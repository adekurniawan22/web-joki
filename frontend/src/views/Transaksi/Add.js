import React, { useState } from 'react'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as yup from 'yup'
import axiosInstance from '../../axiosConfig'
import { NumericFormat } from 'react-number-format'
import { CCol, CRow, CButton, CCard, CCardHeader, CCardBody } from '@coreui/react'
import { Link, useNavigate } from 'react-router-dom'
import config from '../../config'
import { toast } from 'react-toastify'
import { Col, Row, Form as BootstrapForm } from 'react-bootstrap'

// Validasi harga diubah dari string menjadi number
const getValidationSchema = (showAdditionalFields) => {
    return yup.object().shape({
        tipe: yup.string().required('Tipe tugas harus dipilih'),
        judul: yup.string().required('Judul tidak boleh kosong'),
        deskripsi: yup.string().required('Deskripsi tidak boleh kosong'),
        tgl_terima: yup.date().required('Tanggal Terima tidak boleh kosong'),
        tgl_selesai: yup.date().required('Tanggal Selesai tidak boleh kosong'),
        status: yup.string().required('Status harus dipilih'),
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
                          .required('File tidak boleh kosong')
                          .test(
                              'fileType',
                              'Hanya file gambar jpg, jpeg, dan png yang diizinkan',
                              (value) => {
                                  return ['image/jpeg', 'image/jpg', 'image/png'].includes(
                                      value.type,
                                  )
                              },
                          ),
                  }),
              )
            : yup.array(),
    })
}

const FormTambahTransaksi = () => {
    const navigate = useNavigate()
    const [showAdditionalFields, setShowAdditionalFields] = useState(false)

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
                    created_by: 1,
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
            validationSchema={() => getValidationSchema(showAdditionalFields)}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ touched, errors, setFieldValue, isSubmitting, values }) => {
                console.log('Formik Values:', values)
                console.log('Formik Errors:', errors)
                console.log('Formik Touched:', touched)
                console.log('isSubmitting:', isSubmitting)

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
