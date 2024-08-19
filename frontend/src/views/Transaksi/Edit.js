import React, { useState, useEffect } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axiosInstance from '../../axiosConfig'
import { NumericFormat } from 'react-number-format'
import { CCol, CRow, CButton, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import config from '../../config'
import { toast } from 'react-toastify'
import { Col, Row, Form as BootstrapForm } from 'react-bootstrap'
import Select from 'react-select'

// Utility function to convert ISO date to YYYY-MM-DD
const isoToDateString = (isoString) => {
    return isoString ? isoString.split('T')[0] : ''
}

// Utility function to convert YYYY-MM-DD to ISO date
const dateStringToISO = (dateString) => {
    return dateString ? new Date(dateString).toISOString() : ''
}

const getValidationSchema = (showAdditionalFields, status) => {
    return yup.object().shape({
        tipe: yup.string().required('Tipe tugas harus dipilih'),
        judul: yup.string().required('Judul tidak boleh kosong'),
        deskripsi: yup.string().required('Deskripsi tidak boleh kosong'),
        tgl_terima: yup.date().required('Tanggal Terima tidak boleh kosong'),
        tgl_selesai: yup.date().nullable(),
        status: yup.string().required('Status harus dipilih'),
        take_by:
            status === 'dikerjakan' || status === 'selesai'
                ? yup.object().shape({
                      value: yup.string().required('User harus dipilih'),
                  })
                : yup.object().nullable(),
        harga: yup
            .number()
            .required('Harga harus diisi')
            .typeError('Harga harus berupa angka')
            .positive('Harga harus lebih besar dari 0'),
        tambahan: showAdditionalFields
            ? yup.array().of(
                  yup.object().shape({
                      keterangan: yup.string().required('Keterangan tidak boleh kosong'),
                      file: yup
                          .mixed()
                          .test(
                              'fileType',
                              'Hanya file gambar jpg, jpeg, dan png yang diizinkan',
                              function (value) {
                                  const { id } = this.parent
                                  // Return true if id is not null to skip this validation
                                  if (id) {
                                      return true
                                  }
                                  // Check if the file type is valid when id is null
                                  return value
                                      ? [
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
                                        ].includes(value.type) ||
                                            // Validate by file extension if MIME type is not available
                                            [
                                                '.js',
                                                '.py',
                                                '.html',
                                                '.css',
                                                '.doc',
                                                '.docx',
                                                '.xls',
                                                '.xlsx',
                                                '.ppt',
                                                '.pptx',
                                                '.pdf',
                                                '.txt',
                                                '.zip',
                                                '.rar',
                                                '.jpeg',
                                                '.jpg',
                                                '.png',
                                            ].some((ext) => value.name.endsWith(ext))
                                      : false
                              },
                          )
                          .test('required', 'File tidak boleh kosong', function (value) {
                              const { id } = this.parent
                              // Return true if id is not null to skip this validation
                              if (id) {
                                  return true
                              }

                              // Check if file is provided when id is null
                              return value !== null && value !== undefined
                          }),
                  }),
              )
            : yup.array(),
    })
}

const EditTransaksi = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)
    const [status, setStatus] = useState('')
    const [users, setUsers] = useState([])
    const [initialValues, setInitialValues] = useState({
        tipe: '',
        judul: '',
        deskripsi: '',
        tgl_terima: '',
        tgl_selesai: '',
        status: '',
        harga: '',
        created_by: '',
        tambahan: [{ id: null, keterangan: '', file: null }],
    })

    useEffect(() => {
        // Fetch users for select options
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/users`)
                setUsers(
                    response.data.map((user) => ({
                        value: user.id,
                        label: user.nama,
                    })),
                )
            } catch (error) {
                toast.error('Terjadi kesalahan saat memuat data pengguna.')
            }
        }

        // Fetch transaction data
        const fetchTransaksi = async () => {
            try {
                const response = await axiosInstance.get(`${config.apiUrl}/transaksi/${id}`)
                const data = response.data

                // Convert dates
                const tglTerima = isoToDateString(data.tgl_terima)
                const tglSelesai = isoToDateString(data.tgl_selesai)

                // Set initial values
                setInitialValues({
                    tipe: data.tipe,
                    judul: data.judul,
                    deskripsi: data.deskripsi,
                    tgl_terima: tglTerima,
                    tgl_selesai: tglSelesai,
                    status: data.status,
                    harga: data.harga,
                    created_by: data.created_by,
                    take_by: data.take_by,
                    tambahan: data.files.map((file) => ({
                        keterangan: file.keterangan,
                        file: file.file ? file.file : null,
                        id: file.id ? file.id : null,
                    })),
                })

                // Set checkbox state
                setShowAdditionalFields(data.files && data.files.length > 0)
            } catch (error) {
                toast.error('Terjadi kesalahan saat memuat data.')
            }
        }

        fetchUsers()
        fetchTransaksi()
    }, [id])

    const handleSubmit = async (values) => {
        try {
            // Konversi harga
            const hargaInteger = parseInt(values.harga.replace(/[^0-9]/g, ''), 10)

            // Konversi tanggal ke format ISO 8601, termasuk menangani tgl_selesai
            const updatedValues = {
                ...values,
                take_by:
                    values.status === 'dikerjakan' || values.status === 'selesai'
                        ? values.take_by.value
                        : null,
                tgl_terima: dateStringToISO(values.tgl_terima),
                tgl_selesai: values.tgl_selesai ? dateStringToISO(values.tgl_selesai) : null,
                harga: hargaInteger,
            }

            // Kirim data transaksi
            await axiosInstance.put(`${config.apiUrl}/transaksi/${id}`, updatedValues, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            // Kirim file jika ada
            for (const item of values.tambahan) {
                if (item.file) {
                    const formData = new FormData()
                    formData.append('keterangan', item.keterangan)

                    if (item.id) {
                        // Jika item.id ada, kirim hanya keterangan dengan header Content-Type: 'application/json'
                        await axiosInstance.post(
                            `${config.apiUrl}/file-transaksi/${item.id}?_method=PUT`,
                            formData,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            },
                        )
                    } else {
                        // Jika item.id tidak ada, kirim id_transaksi, keterangan, dan file dengan header Content-Type: 'multipart/form-data'
                        formData.append('id_transaksi', id)
                        formData.append('file', item.file)

                        await axiosInstance.post(`${config.apiUrl}/file-transaksi`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        })
                    }
                }
            }

            toast.success('Data berhasil diperbarui!')
            navigate('/transaksi')
        } catch (error) {
            toast.error('Terjadi kesalahan saat memperbarui data.')
        }
    }

    const handleDeleteFile = async (itemId) => {
        try {
            await axiosInstance.delete(`${config.apiUrl}/file-transaksi/${itemId}`)
            toast.success('File berhasil dihapus!')
        } catch (error) {
            toast.error('Terjadi kesalahan saat menghapus file.')
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
                console.log('initialValues:', initialValues.take_by)
                return (
                    <CRow>
                        <CCol xs={12}>
                            <CCard className="mb-4">
                                <CCardHeader>
                                    <strong>Edit Transaksi</strong>
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
                                        <Row>
                                            <Col md={6}>
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

                                            <Col md={6}>
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
                                        {(values.status === 'dikerjakan' ||
                                            values.status === 'selesai') && (
                                            <div className="mb-3">
                                                <BootstrapForm.Group controlId="validationFormikUser">
                                                    <BootstrapForm.Label>User</BootstrapForm.Label>
                                                    <Select
                                                        options={users}
                                                        onChange={(option) =>
                                                            setFieldValue('take_by', option)
                                                        }
                                                        value={
                                                            values.take_by
                                                                ? users.find(
                                                                      (user) =>
                                                                          user.value ===
                                                                          values.take_by,
                                                                  )
                                                                : null
                                                        }
                                                        className={`basic-single ${touched.take_by && errors.take_by ? 'is-invalid' : ''} ${touched.take_by && !errors.take_by && !isSubmitting ? 'is-valid' : ''}`}
                                                    />
                                                    <ErrorMessage
                                                        name="take_by"
                                                        component="div"
                                                        className="invalid-feedback"
                                                    />
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
                                                    value={values.harga}
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
                                                    checked={showAdditionalFields}
                                                    onChange={(e) => {
                                                        setShowAdditionalFields(e.target.checked)
                                                    }}
                                                />
                                            </BootstrapForm.Group>
                                        </div>

                                        {/* Conditionally render additional fields */}
                                        {showAdditionalFields && (
                                            <div className="mb-3">
                                                <div className="row">
                                                    {values.tambahan.map((item, index) => (
                                                        <div key={index} className="col-6 mb-3">
                                                            <div className="row bg-light mx-0 py-3 rounded">
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
                                                                        {item.id ? (
                                                                            <>
                                                                                <a
                                                                                    href={`${config.apiBiasa}/storage/${item.file}`}
                                                                                    target="_blank"
                                                                                    className="mb-2"
                                                                                    rel="noopener noreferrer"
                                                                                    style={{
                                                                                        display:
                                                                                            'block',
                                                                                        overflow:
                                                                                            'hidden',
                                                                                        textOverflow:
                                                                                            'ellipsis',
                                                                                        maxWidth:
                                                                                            '100%',
                                                                                        overflowWrap:
                                                                                            'break-word',
                                                                                    }}
                                                                                >
                                                                                    {item.file}
                                                                                </a>
                                                                            </>
                                                                        ) : (
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(
                                                                                    event,
                                                                                ) => {
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
                                                                        )}
                                                                        <div
                                                                            className={`invalid-feedback ${touched.tambahan && touched.tambahan[index]?.file ? 'd-block' : ''}`}
                                                                        >
                                                                            <ErrorMessage
                                                                                name={`tambahan.${index}.file`}
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                                // Use the `render` prop to customize the error message
                                                                                render={(msg) => {
                                                                                    // Customize error message if it's the specific one
                                                                                    if (
                                                                                        msg ===
                                                                                        `tambahan[${index}].file cannot be null`
                                                                                    ) {
                                                                                        return (
                                                                                            <div>
                                                                                                File
                                                                                                tidak
                                                                                                boleh
                                                                                                kosong
                                                                                            </div>
                                                                                        )
                                                                                    }
                                                                                    // Default rendering for other errors
                                                                                    return (
                                                                                        <div>
                                                                                            {msg}
                                                                                        </div>
                                                                                    )
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    </BootstrapForm.Group>
                                                                </div>
                                                                {(item.id ||
                                                                    values.tambahan.length > 1) && (
                                                                    <div className="col-12 mt-2">
                                                                        <CButton
                                                                            type="button"
                                                                            color="danger"
                                                                            className="w-100 text-light"
                                                                            onClick={() => {
                                                                                if (item.id) {
                                                                                    handleDeleteFile(
                                                                                        item.id,
                                                                                    )
                                                                                }
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
                                                <CButton
                                                    className="mY-3"
                                                    type="button"
                                                    color="primary"
                                                    onClick={() => {
                                                        setFieldValue('tambahan', [
                                                            ...values.tambahan,
                                                            {
                                                                id: null,
                                                                keterangan: '',
                                                                file: null,
                                                            },
                                                        ])
                                                    }}
                                                >
                                                    Tambah Input
                                                </CButton>
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

export default EditTransaksi
