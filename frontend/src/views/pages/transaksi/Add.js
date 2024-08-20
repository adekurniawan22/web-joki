import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axiosInstance from '../../../axiosConfig'
import { NumericFormat } from 'react-number-format'
import { CCol, CRow, CButton, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import config from '../../../config'
import { toast } from 'react-toastify'
import { Col, Row, Form as BootstrapForm } from 'react-bootstrap'
import Select from 'react-select'

// Validasi harga diubah dari string menjadi number
const getValidationSchema = (showAdditionalFields, status) => {
    return yup.object().shape({
        tipe: yup.string().required('Tipe tugas harus dipilih'),
        judul: yup.string().required('Judul tidak boleh kosong'),
        deskripsi: yup.string().required('Deskripsi tidak boleh kosong'),
        tgl_terima: yup.date().required('Tanggal Terima tidak boleh kosong'),
        tgl_selesai: yup.date().nullable(),
        status: yup.string().required('Status harus dipilih'),
        harga: yup
            .number()
            .required('Harga harus diisi')
            .typeError('Harga harus berupa angka')
            .positive('Harga harus lebih besar dari 0'),
        take_by:
            status === 'dikerjakan' || status === 'selesai'
                ? yup.object().shape({
                      value: yup.string().required('User harus dipilih'),
                  })
                : yup.object().nullable(),
        tambahan: showAdditionalFields
            ? yup.array().of(
                  yup.object().shape({
                      keterangan: yup.string().required('Keterangan tidak boleh kosong'),
                      file: yup
                          .mixed()
                          .required('File tidak boleh kosong')
                          .test(
                              'fileType',
                              'Hanya file dengan ekstensi yang diizinkan yang diizinkan',
                              (value) => {
                                  if (!value) return false
                                  const allowedTypes = [
                                      'application/pdf',
                                      'application/msword',
                                      'application/vnd.ms-excel',
                                      'application/vnd.ms-powerpoint',
                                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                      'text/plain',
                                      'application/zip',
                                      'application/x-zip-compressed',
                                      'application/x-rar-compressed',
                                      'image/jpeg',
                                      'image/jpg',
                                      'image/png',
                                      'video/mp4', // .mp4
                                      'audio/mpeg', // .mp3
                                      'application/javascript', // .js
                                      'text/x-python', // .py
                                      'text/html', // .html
                                      'text/css', // .css
                                  ]
                                  return (
                                      allowedTypes.includes(value.type) ||
                                      // Validate by file extension if MIME type is not available
                                      ['.js', '.py', '.html', '.css'].some((ext) =>
                                          value.name.endsWith(ext),
                                      )
                                  )
                              },
                          ),
                  }),
              )
            : yup.array(),
    })
}

const FormTambahTransaksi = () => {
    const [users, setUsers] = useState([]) // State for users

    // Fetch users (example URL, adjust as needed)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/users`)
                // Filter users based on role
                const filteredUsers = response.data
                    .filter((user) => user.role === 'penjoki') // Filter users with role 'penjoki'
                    .map((user) => ({ value: user.id, label: user.nama })) // Map to the desired format
                setUsers(filteredUsers)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        fetchUsers()
    }, [])

    const navigate = useNavigate()
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [status, setStatus] = useState('')

    const initialValues = {
        tipe: '',
        judul: '',
        deskripsi: '',
        tgl_terima: '',
        tgl_selesai: '',
        status: '',
        harga: '',
        created_by: '',
        tambahan: [{ keterangan: '', file: null }], // Initial state for additional fields
        take_by: null,
    }

    const handleSubmit = async (values) => {
        try {
            // Konversi harga
            const hargaInteger = parseInt(values.harga.replace(/[^0-9]/g, ''), 10)

            // Kirim data transaksi
            const response = await axiosInstance.post(
                `${config.apiUrl}/transaksi`,
                {
                    ...values,
                    take_by:
                        values.status === 'dikerjakan' || values.status === 'selesai'
                            ? values.take_by.value
                            : null,
                    created_by: localStorage.getItem('user_id'),
                    tgl_selesai: values.tgl_selesai ? values.tgl_selesai : null,
                    harga: hargaInteger,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            toast.success('Data berhasil ditambahkan!')

            // Kirim file jika ada
            for (const item of values.tambahan) {
                if (item.file) {
                    const formData = new FormData()
                    formData.append('id_transaksi', response.data.data.id)
                    formData.append('keterangan', item.keterangan)
                    formData.append('file', item.file)

                    // Kirim data file
                    await axiosInstance.post(`${config.apiUrl}/file-transaksi`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    })
                }
            }

            navigate('/transaksi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menambahkan data.')
        }
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={() => getValidationSchema(showAdditionalFields, status)}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ touched, errors, setFieldValue, isSubmitting, values }) => {
                return (
                    <CRow>
                        <CCol xs={12}>
                            <CCard className="mb-4">
                                <CCardHeader>
                                    <strong>Form Transaksi</strong>
                                </CCardHeader>
                                <CCardBody>
                                    <Form>
                                        {/* Tipe */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="validationFormik01">
                                                <BootstrapForm.Label>Tipe</BootstrapForm.Label>
                                                <Field
                                                    as="select"
                                                    name="tipe"
                                                    className={`form-control ${touched.tipe && errors.tipe ? 'is-invalid' : ''} ${touched.tipe && !errors.tipe && !isSubmitting ? 'is-valid' : ''}`}
                                                >
                                                    <option value="">Pilih Tipe Tugas</option>
                                                    <option value="Joki Tugas">Joki Tugas</option>
                                                    <option value="Joki Game">Joki Game</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="tipe"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                                {!errors.tipe && touched.tipe && !isSubmitting && (
                                                    <div className="valid-feedback">
                                                        Looks good!
                                                    </div>
                                                )}
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Judul */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="validationFormik02">
                                                <BootstrapForm.Label>Judul</BootstrapForm.Label>
                                                <Field
                                                    type="text"
                                                    name="judul"
                                                    className={`form-control ${touched.judul && errors.judul ? 'is-invalid' : ''} ${touched.judul && !errors.judul && !isSubmitting ? 'is-valid' : ''}`}
                                                />
                                                <ErrorMessage
                                                    name="judul"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                                {!errors.judul &&
                                                    touched.judul &&
                                                    !isSubmitting && (
                                                        <div className="valid-feedback">
                                                            Looks good!
                                                        </div>
                                                    )}
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Deskripsi */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="validationFormik03">
                                                <BootstrapForm.Label>Deskripsi</BootstrapForm.Label>
                                                <Field
                                                    as="textarea"
                                                    name="deskripsi"
                                                    className={`form-control ${touched.deskripsi && errors.deskripsi ? 'is-invalid' : ''} ${touched.deskripsi && !errors.deskripsi && !isSubmitting ? 'is-valid' : ''}`}
                                                />
                                                <ErrorMessage
                                                    name="deskripsi"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                                {!errors.deskripsi &&
                                                    touched.deskripsi &&
                                                    !isSubmitting && (
                                                        <div className="valid-feedback">
                                                            Looks good!
                                                        </div>
                                                    )}
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Tanggal Terima */}
                                        <Row className="mb-3">
                                            <Col md="6">
                                                <div className="mb-3">
                                                    <BootstrapForm.Group controlId="validationFormik04">
                                                        <BootstrapForm.Label>
                                                            Tanggal Terima
                                                        </BootstrapForm.Label>
                                                        <Field
                                                            type="date"
                                                            name="tgl_terima"
                                                            className={`form-control ${touched.tgl_terima && errors.tgl_terima ? 'is-invalid' : ''} ${touched.tgl_terima && !errors.tgl_terima && !isSubmitting ? 'is-valid' : ''}`}
                                                        />
                                                        <ErrorMessage
                                                            name="tgl_terima"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                        {!errors.tgl_terima &&
                                                            touched.tgl_terima &&
                                                            !isSubmitting && (
                                                                <div className="valid-feedback">
                                                                    Looks good!
                                                                </div>
                                                            )}
                                                    </BootstrapForm.Group>
                                                </div>
                                            </Col>

                                            {/* Tanggal Selesai */}
                                            <Col md="6">
                                                <div className="mb-3">
                                                    <BootstrapForm.Group controlId="validationFormik05">
                                                        <BootstrapForm.Label>
                                                            Tanggal Selesai
                                                        </BootstrapForm.Label>
                                                        <Field
                                                            type="date"
                                                            name="tgl_selesai"
                                                            className={`form-control ${touched.tgl_selesai && errors.tgl_selesai ? 'is-invalid' : ''} ${touched.tgl_selesai && !errors.tgl_selesai && !isSubmitting ? 'is-valid' : ''}`}
                                                        />
                                                        <ErrorMessage
                                                            name="tgl_selesai"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                        {!errors.tgl_selesai &&
                                                            touched.tgl_selesai &&
                                                            !isSubmitting && (
                                                                <div className="valid-feedback">
                                                                    Looks good!
                                                                </div>
                                                            )}
                                                    </BootstrapForm.Group>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Status */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="validationFormik06">
                                                <BootstrapForm.Label>Status</BootstrapForm.Label>
                                                <Field
                                                    as="select"
                                                    name="status"
                                                    className={`form-control ${touched.status && errors.status ? 'is-invalid' : ''} ${touched.status && !errors.status && !isSubmitting ? 'is-valid' : ''}`}
                                                    onChange={(e) => {
                                                        setStatus(e.target.value) // Update status state
                                                        setFieldValue('status', e.target.value)
                                                    }}
                                                >
                                                    <option value="">Pilih Status</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="dikerjakan">Dikerjakan</option>
                                                    <option value="selesai">Selesai</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="status"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                                {!errors.status &&
                                                    touched.status &&
                                                    !isSubmitting && (
                                                        <div className="valid-feedback">
                                                            Looks good!
                                                        </div>
                                                    )}
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* User Select (conditionally rendered) */}
                                        {(status === 'dikerjakan' || status === 'selesai') && (
                                            <div className="mb-3">
                                                <BootstrapForm.Group controlId="validationFormikUser">
                                                    <BootstrapForm.Label>
                                                        Take By
                                                    </BootstrapForm.Label>
                                                    <Select
                                                        options={users}
                                                        onChange={(option) =>
                                                            setFieldValue('take_by', option)
                                                        }
                                                        value={values.user}
                                                        className={`basic-single ${touched.take_by && errors.take_by ? 'is-invalid' : ''} ${touched.take_by && !errors.take_by && !isSubmitting ? 'is-valid' : ''}`}
                                                    />
                                                    <div
                                                        className={`invalid-feedback ${touched.take_by && touched.take_by ? 'd-block' : ''}`}
                                                    >
                                                        <ErrorMessage
                                                            name="take_by"
                                                            component="div"
                                                            className="invalid-feedback"
                                                            // Use the `render` prop to customize the error message
                                                            render={(msg) => {
                                                                // Customize error message if it's the specific one
                                                                if (
                                                                    msg === `take_by cannot be null`
                                                                ) {
                                                                    return (
                                                                        <div>
                                                                            Take By tidak boleh
                                                                            kosong
                                                                        </div>
                                                                    )
                                                                }
                                                                // Default rendering for other errors
                                                                return <div>{msg}</div>
                                                            }}
                                                        />
                                                    </div>
                                                    {!errors.take_by &&
                                                        touched.take_by &&
                                                        !isSubmitting && (
                                                            <div className="valid-feedback">
                                                                Looks good!
                                                            </div>
                                                        )}
                                                </BootstrapForm.Group>
                                            </div>
                                        )}

                                        {/* Harga */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="validationFormik07">
                                                <BootstrapForm.Label>Harga</BootstrapForm.Label>
                                                <NumericFormat
                                                    displayType="input"
                                                    name="harga"
                                                    thousandSeparator
                                                    prefix="Rp "
                                                    value={initialValues.harga}
                                                    onValueChange={({ value }) =>
                                                        setFieldValue('harga', value)
                                                    }
                                                    className={`form-control ${touched.harga && errors.harga ? 'is-invalid' : ''} ${touched.harga && !errors.harga && !isSubmitting ? 'is-valid' : ''}`}
                                                />
                                                <ErrorMessage
                                                    name="harga"
                                                    component="div"
                                                    className="invalid-feedback"
                                                />
                                                {!errors.harga &&
                                                    touched.harga &&
                                                    !isSubmitting && (
                                                        <div className="valid-feedback">
                                                            Looks good!
                                                        </div>
                                                    )}
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Checkbox for additional inputs */}
                                        <div className="mb-3">
                                            <BootstrapForm.Group controlId="checkboxAdditional">
                                                <BootstrapForm.Check
                                                    type="checkbox"
                                                    label="Apakah ada file tambahan?"
                                                    onChange={(e) => {
                                                        setShowAdditionalFields(e.target.checked)
                                                        if (!e.target.checked) {
                                                            setFieldValue('tambahan', [
                                                                { keterangan: '', file: null },
                                                            ])
                                                        }
                                                    }}
                                                />
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Conditionally render additional fields */}
                                        {showAdditionalFields && (
                                            <div className="mb-3">
                                                <CButton
                                                    className="mb-3"
                                                    type="button"
                                                    color="primary"
                                                    onClick={() => {
                                                        setFieldValue('tambahan', [
                                                            ...values.tambahan,
                                                            { keterangan: '', file: null },
                                                        ])
                                                    }}
                                                >
                                                    Tambah Input
                                                </CButton>
                                                <div className="row">
                                                    {values.tambahan.map((item, index) => (
                                                        <div key={index} className="col-6 mb-3">
                                                            <div className="row bg-secondary mx-0 py-3 rounded">
                                                                <div className="col-12 mb-2">
                                                                    <BootstrapForm.Group
                                                                        controlId={`keterangan-${index}`}
                                                                    >
                                                                        <BootstrapForm.Label>
                                                                            Keterangan
                                                                        </BootstrapForm.Label>
                                                                        <Field
                                                                            type="text"
                                                                            name={`tambahan.${index}.keterangan`}
                                                                            className={`form-control ${touched.tambahan && touched.tambahan[index]?.keterangan && errors.tambahan && errors.tambahan[index]?.keterangan ? 'is-invalid' : ''}`}
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`tambahan.${index}.keterangan`}
                                                                            component="div"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </BootstrapForm.Group>
                                                                </div>
                                                                <div className="col-12">
                                                                    <BootstrapForm.Group
                                                                        controlId={`file-${index}`}
                                                                    >
                                                                        <BootstrapForm.Label>
                                                                            File
                                                                        </BootstrapForm.Label>
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            onChange={(event) => {
                                                                                const file =
                                                                                    event
                                                                                        .currentTarget
                                                                                        .files[0]
                                                                                setFieldValue(
                                                                                    `tambahan.${index}.file`,
                                                                                    file,
                                                                                )
                                                                            }}
                                                                            className={`form-control ${touched.tambahan && touched.tambahan[index]?.file && errors.tambahan && errors.tambahan[index]?.file ? 'is-invalid' : ''}`}
                                                                        />
                                                                        <ErrorMessage
                                                                            name={`tambahan.${index}.file`}
                                                                            component="div"
                                                                            className="invalid-feedback"
                                                                        />
                                                                    </BootstrapForm.Group>
                                                                </div>
                                                                {values.tambahan.length > 1 && (
                                                                    <div className="col-12 mt-2">
                                                                        <CButton
                                                                            type="button"
                                                                            color="danger"
                                                                            onClick={() => {
                                                                                const newAdditionalFields =
                                                                                    values.tambahan.filter(
                                                                                        (_, idx) =>
                                                                                            idx !==
                                                                                            index,
                                                                                    )
                                                                                setFieldValue(
                                                                                    'tambahan',
                                                                                    newAdditionalFields,
                                                                                )
                                                                            }}
                                                                        >
                                                                            Hapus
                                                                        </CButton>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-4 mt-4 text-end">
                                            <Link to="/transaksi" className="btn btn-secondary">
                                                Kembali
                                            </Link>
                                            <CButton
                                                color="primary ms-2"
                                                type="submit"
                                                disabled={isSubmitting}
                                            >
                                                Simpan
                                            </CButton>
                                        </div>
                                    </Form>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                )
            }}
        </Formik>
    )
}

export default FormTambahTransaksi
