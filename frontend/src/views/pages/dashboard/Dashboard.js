import React, { useEffect, useState, useRef } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow, CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPeople, cilBadge, cilChartPie } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import config from '../../../config'
import { getStyle } from '@coreui/utils'
import axiosInstance from '../../../axiosConfig'
import { ToastContainer, toast } from 'react-toastify'

const Dashboard = () => {
    useEffect(() => {
        const toastShown = localStorage.getItem('dashboardToastShown')

        if (!toastShown) {
            toast.success('Berhasil Login')
            localStorage.setItem('dashboardToastShown', 'true')
        }
    }, [])

    const [role, setRole] = useState('')
    const [userCounts, setUserCounts] = useState({ owner: 0, admin: 0, penjoki: 0 })
    const [topPenjokis, setTopPenjokis] = useState([])
    const [transactionCounts, setTransactionCounts] = useState({
        pending: 0,
        dikerjakan: 0,
        selesai: 0,
    })
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Transaksi',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [],
            },
        ],
    })
    const [chartDataGaji, setChartDataGaji] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Gaji',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                data: [],
            },
        ],
    })
    const [maxY, setMaxY] = useState(0)
    const [maxYGaji, setMaxYGaji] = useState(0)
    const [tahun, setTahun] = useState('')
    const chartRef = useRef(null)

    useEffect(() => {
        const storedRole = localStorage.getItem('role')
        setRole(storedRole)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (role === 'owner') {
                    const userCountResponse = await axiosInstance.get(
                        `${config.apiUrl}/jumlah-user-by-role`,
                    )
                    setUserCounts(userCountResponse.data)

                    const { data: topPenjokiData } = await axiosInstance.get(
                        `${config.apiUrl}/top-penjoki/3`,
                    )
                    const topPenjokis = Array.isArray(topPenjokiData.top_penjoki)
                        ? topPenjokiData.top_penjoki
                        : []
                    setTopPenjokis(topPenjokis)
                } else if (role === 'admin') {
                    const transactionCountsResponse = await axiosInstance.get(
                        `${config.apiUrl}/jumlah-transaksi-by-status`,
                    )
                    setTransactionCounts(transactionCountsResponse.data)
                } else if (role === 'penjoki') {
                    const userId = localStorage.getItem('user_id')
                    const transactionCountsResponse = await axiosInstance.get(
                        `${config.apiUrl}/jumlah-transaksi-by-status/` + userId,
                    )
                    setTransactionCounts(transactionCountsResponse.data)
                    const { data: gajiData } = await axiosInstance.get(
                        `${config.apiUrl}/jumlah-gaji-perbulan/${userId}`,
                    )

                    const labels = [
                        'Januari',
                        'Februari',
                        'Maret',
                        'April',
                        'Mei',
                        'Juni',
                        'Juli',
                        'Agustus',
                        'September',
                        'Oktober',
                        'November',
                        'Desember',
                    ]
                    const dataPoints = Object.keys(gajiData.data).map(
                        (month) => gajiData.data[month],
                    )
                    const maxDataValue = Math.max(...dataPoints)
                    const suggestedMax = maxDataValue + 50000

                    setChartDataGaji({
                        labels,
                        datasets: [
                            {
                                label: 'Total Gaji',
                                data: dataPoints,
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                                type: 'bar',
                            },
                        ],
                    })
                    setMaxYGaji(suggestedMax)
                    setTahun(gajiData.tahun)
                }

                const userId = role === 'penjoki' ? localStorage.getItem('user_id') : ''
                const { data: transaksiData } = await axiosInstance.get(
                    `${config.apiUrl}/jumlah-transaksi-perbulan${userId ? '/' + userId : ''}`,
                )

                const labels = [
                    'Januari',
                    'Februari',
                    'Maret',
                    'April',
                    'Mei',
                    'Juni',
                    'Juli',
                    'Agustus',
                    'September',
                    'Oktober',
                    'November',
                    'Desember',
                ]
                const dataPoints = Object.keys(transaksiData.data).map(
                    (month) => transaksiData.data[month],
                )
                const maxDataValue = Math.max(...dataPoints)
                const suggestedMax = maxDataValue + 1

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Transaksi',
                            data: dataPoints,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            type: 'bar',
                        },
                    ],
                })
                setTahun(transaksiData.tahun)
                setMaxY(suggestedMax)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        if (role) {
            fetchData()
        }
    }, [role])

    useEffect(() => {
        const handleColorSchemeChange = () => {
            if (chartRef.current) {
                setTimeout(() => {
                    chartRef.current.options.scales.x.grid.borderColor = getStyle(
                        '--cui-border-color-translucent',
                    )
                    chartRef.current.options.scales.x.grid.color = getStyle(
                        '--cui-border-color-translucent',
                    )
                    chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
                    chartRef.current.options.scales.y.grid.borderColor = getStyle(
                        '--cui-border-color-translucent',
                    )
                    chartRef.current.options.scales.y.grid.color = getStyle(
                        '--cui-border-color-translucent',
                    )
                    chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
                    chartRef.current.update()
                })
            }
        }

        document.documentElement.addEventListener('ColorSchemeChange', handleColorSchemeChange)
        return () => {
            document.documentElement.removeEventListener(
                'ColorSchemeChange',
                handleColorSchemeChange,
            )
        }
    }, [])

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            display: true,
            legend: {
                labels: {
                    color: getStyle('--cui-body-color'),
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                },
            },
            y: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                    stepSize: 1,
                },
                suggestedMax: maxY,
            },
        },
    }

    const chartOptionsGaji = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            display: true,
            legend: {
                labels: {
                    color: getStyle('--cui-body-color'),
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        const value = tooltipItem.raw // Pastikan ini adalah angka
                        return `Rp. ${Number(value).toLocaleString('id-ID')}` // Format ribuan dengan awalan "Rp."
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                },
            },
            y: {
                grid: {
                    color: getStyle('--cui-border-color-translucent'),
                },
                ticks: {
                    color: getStyle('--cui-body-color'),
                    stepSize: 50000,
                    callback: function (value) {
                        return `Rp. ${value.toLocaleString('id-ID')}` // Menambahkan "Rp." dan memformat angka
                    },
                },
                suggestedMax: maxYGaji,
            },
        },
    }

    const handleDownload = async (url) => {
        try {
            const response = await axiosInstance.get(url, { responseType: 'blob' })
            const blob = new Blob([response.data])
            const link = document.createElement('a')
            const fileName = url.includes('monthly-salary-summary')
                ? 'monthly_salary_summary.pdf'
                : 'monthly_summary.pdf'
            link.href = window.URL.createObjectURL(blob)
            link.setAttribute('download', fileName)
            document.body.appendChild(link)
            link.click()
            link.remove()
        } catch (error) {
            console.error('Error downloading file', error)
        }
    }

    return (
        <>
            <ToastContainer style={{ zIndex: 9999 }} />
            {role === 'penjoki' && (
                <>
                    <CRow>
                        <CCol lg={6}>
                            <CWidgetStatsF
                                className="mb-3"
                                color="info"
                                icon={<CIcon icon={cilChartPie} height={24} />}
                                padding={false}
                                title="TRANSAKSI DIKERJAKAN"
                                value={transactionCounts.dikerjakan}
                            />
                        </CCol>
                        <CCol lg={6}>
                            <CWidgetStatsF
                                className="mb-3"
                                color="success"
                                icon={<CIcon icon={cilChartPie} height={24} />}
                                padding={false}
                                title="TRANSAKSI SELESAI"
                                value={transactionCounts.selesai}
                            />
                        </CCol>
                    </CRow>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={5}>
                                    <h4 id="traffic" className="card-title mb-0">
                                        Gaji Per Bulan Tahun {tahun}
                                    </h4>
                                </CCol>
                                <CCol sm={7} className="d-none d-md-block">
                                    <CButton
                                        color="primary"
                                        className="float-end"
                                        onClick={() =>
                                            handleDownload(
                                                `${config.apiUrl}/export-monthly-salary-summary/${localStorage.getItem('user_id')}`,
                                            )
                                        }
                                    >
                                        <CIcon icon={cilCloudDownload} />
                                    </CButton>
                                </CCol>
                            </CRow>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '70vh',
                                    width: '100%',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <CChart
                                        style={{ height: '100%' }}
                                        type="bar"
                                        data={chartDataGaji}
                                        ref={chartRef}
                                        options={chartOptionsGaji}
                                    />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>

                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={5}>
                                    <h4 id="traffic" className="card-title mb-0">
                                        Transaksi Per Bulan Tahun {tahun}
                                    </h4>
                                </CCol>
                                <CCol sm={7} className="d-none d-md-block">
                                    <CButton
                                        color="primary"
                                        className="float-end"
                                        onClick={() =>
                                            handleDownload(
                                                `${config.apiUrl}/export-monthly-summary/${localStorage.getItem('user_id')}`,
                                            )
                                        }
                                    >
                                        <CIcon icon={cilCloudDownload} />
                                    </CButton>
                                </CCol>
                            </CRow>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '70vh',
                                    width: '100%',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <CChart
                                        style={{ height: '100%' }}
                                        type="bar"
                                        data={chartData}
                                        ref={chartRef}
                                        options={chartOptions}
                                    />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </>
            )}

            {role !== 'penjoki' && (
                <>
                    <CRow>
                        {role === 'owner' && (
                            <>
                                <CCol lg={6} md={12}>
                                    <CWidgetStatsF
                                        className="mb-3"
                                        color="success"
                                        icon={
                                            <div className="d-flex align-items-center">
                                                <CIcon
                                                    icon={cilPeople}
                                                    height={48}
                                                    className="h-100"
                                                />
                                                <span style={{ marginLeft: '8px' }}>
                                                    Total User
                                                </span>
                                            </div>
                                        }
                                        title={
                                            <ul
                                                style={{
                                                    listStyleType: 'none',
                                                    paddingLeft: 0,
                                                    margin: 0,
                                                    fontSize: '1em',
                                                }}
                                            >
                                                <li>{userCounts.owner} Owner</li>
                                                <li>{userCounts.admin} Admin</li>
                                                <li>{userCounts.penjoki} Penjoki</li>
                                            </ul>
                                        }
                                        padding={false}
                                    />
                                </CCol>
                                <CCol lg={6} md={12}>
                                    <CWidgetStatsF
                                        className="mb-3"
                                        color="warning"
                                        icon={
                                            <div className="d-flex align-items-center">
                                                <CIcon
                                                    icon={cilBadge}
                                                    height={48}
                                                    className="h-100"
                                                />
                                                <span
                                                    style={{ marginLeft: '8px', fontSize: '1.2em' }}
                                                >
                                                    Top 3 Penjoki
                                                </span>
                                            </div>
                                        }
                                        title={
                                            <ul
                                                style={{
                                                    listStyleType: 'none',
                                                    paddingLeft: 0,
                                                    margin: 0,
                                                    fontSize: '1em',
                                                }}
                                            >
                                                {topPenjokis.map((penjoki, index) => (
                                                    <li key={penjoki.id}>
                                                        {index + 1 + '. '}
                                                        {penjoki.nama} ({penjoki.transaksi_count}{' '}
                                                        Transaksi)
                                                    </li>
                                                ))}
                                            </ul>
                                        }
                                        padding={false}
                                    />
                                </CCol>
                            </>
                        )}

                        {role === 'admin' && (
                            <>
                                <CCol lg={4}>
                                    <CWidgetStatsF
                                        className="mb-3"
                                        color="warning"
                                        icon={<CIcon icon={cilChartPie} height={24} />}
                                        padding={false}
                                        title="TRANSAKSI PENDING"
                                        value={transactionCounts.pending}
                                    />
                                </CCol>
                                <CCol lg={4}>
                                    <CWidgetStatsF
                                        className="mb-3"
                                        color="info"
                                        icon={<CIcon icon={cilChartPie} height={24} />}
                                        padding={false}
                                        title="TRANSAKSI DIKERJAKAN"
                                        value={transactionCounts.dikerjakan}
                                    />
                                </CCol>
                                <CCol lg={4}>
                                    <CWidgetStatsF
                                        className="mb-3"
                                        color="success"
                                        icon={<CIcon icon={cilChartPie} height={24} />}
                                        padding={false}
                                        title="TRANSAKSI SELESAI"
                                        value={transactionCounts.selesai}
                                    />
                                </CCol>
                            </>
                        )}
                    </CRow>
                    <CCard className="mb-4">
                        <CCardBody>
                            <CRow>
                                <CCol sm={5}>
                                    <h4 id="traffic" className="card-title mb-0">
                                        Transaksi Per Bulan Tahun {tahun}
                                    </h4>
                                </CCol>
                                <CCol sm={7} className="d-none d-md-block">
                                    <CButton
                                        color="primary"
                                        className="float-end"
                                        onClick={() =>
                                            handleDownload(
                                                `${config.apiUrl}/export-monthly-summary`,
                                            )
                                        }
                                    >
                                        <CIcon icon={cilCloudDownload} />
                                    </CButton>
                                </CCol>
                            </CRow>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '70vh',
                                    width: '100%',
                                }}
                            >
                                <div style={{ flex: 1 }}>
                                    <CChart
                                        style={{ height: '100%' }}
                                        type="bar"
                                        data={chartData}
                                        ref={chartRef}
                                        options={chartOptions}
                                    />
                                </div>
                            </div>
                        </CCardBody>
                    </CCard>
                </>
            )}
        </>
    )
}

export default Dashboard
