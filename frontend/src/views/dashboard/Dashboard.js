import React, { useEffect, useState, useRef } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow, CWidgetStatsF } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCloudDownload, cilPeople, cilBadge } from '@coreui/icons'
import { CChart } from '@coreui/react-chartjs'
import config from '../../config'
import { getStyle } from '@coreui/utils'
import axiosInstance from '../../axiosConfig'

const Dashboard = () => {
    const [userCounts, setUserCounts] = useState({ owner: 0, admin: 0, penjoki: 0 })
    const [topPenjokis, setTopPenjokis] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch user counts by role
                const userCountResponse = await axiosInstance.get(
                    `${config.apiUrl}/count-user-by-role`,
                )
                setUserCounts(userCountResponse.data)

                // Fetch top penjoki
                const { data: topPenjokiData } = await axiosInstance.get(
                    `${config.apiUrl}/top-penjoki`,
                )
                const topPenjokis = Array.isArray(topPenjokiData.top_penjoki)
                    ? topPenjokiData.top_penjoki
                    : []

                // Update state
                setTopPenjokis(topPenjokis)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

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

    const [maxY, setMaxY] = useState(0)
    const [tahun, setTahun] = useState('')

    useEffect(() => {
        // Ganti URL dengan endpoint API Anda
        axiosInstance
            .get(`${config.apiUrl}/tes`)
            .then((response) => {
                const { tahun, data } = response.data

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

                const dataPoints = Object.keys(data).map((month) => data[month])

                const maxDataValue = Math.max(...dataPoints)
                const suggestedMax = maxDataValue + 1

                setChartData({
                    labels: labels,
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

                setTahun(tahun)
                setMaxY(suggestedMax)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
    }, [])

    const chartRef = useRef(null)

    useEffect(() => {
        document.documentElement.addEventListener('ColorSchemeChange', () => {
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
        })
    }, [chartRef])

    const chartOptions = {
        responsive: true, // Enable responsive behavior
        maintainAspectRatio: false, // Allow chart to resize according to container
        plugins: {
            display: true, // Display
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

    return (
        <>
            <CRow>
                <CCol lg={6} md={12}>
                    <CWidgetStatsF
                        className="mb-3"
                        color="success"
                        icon={
                            <div className="d-flex align-items-center">
                                <CIcon icon={cilPeople} height={'3em'} className="h-100" />
                                <span style={{ marginLeft: '8px' }}>Total User </span>
                            </div>
                        }
                        title={
                            <ul
                                style={{
                                    listStyleType: 'none',
                                    paddingLeft: 0,
                                    margin: 0,
                                    fontSize: '1em', // Font size relative to parent
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
                                <CIcon icon={cilBadge} height={'3em'} className="h-100" />
                                <span style={{ marginLeft: '8px', fontSize: '1.2em' }}>
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
                                    fontSize: '1em', // Font size relative to parent
                                }}
                            >
                                {topPenjokis.map((penjoki, index) => (
                                    <li key={penjoki.id}>
                                        {index + 1 + '. '}
                                        {penjoki.nama} ({penjoki.transaksi_count} Transaksi)
                                    </li>
                                ))}
                            </ul>
                        }
                        padding={false}
                    />
                </CCol>
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
                            <CButton color="primary" className="float-end">
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
    )
}

export default Dashboard
