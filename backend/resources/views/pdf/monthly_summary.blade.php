<!DOCTYPE html>
<html>

<head>
    <title>Monthly Transaction Summary</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }

        table,
        th,
        td {
            border: 1px solid black;
        }

        th,
        td {
            padding: 8px;
            text-align: center;
        }
    </style>
</head>

<body>
    <h3>Ringkasan Transaksi Bulanan untuk {{ $tahun }}</h3>
    <table>
        <thead>
            <tr>
                <th>Bulan</th>
                <th>Jumlah Transaksi</th>
            </tr>
        </thead>
        <tbody>
            @php
                $bulanNames = [
                    1 => 'Januari',
                    2 => 'Februari',
                    3 => 'Maret',
                    4 => 'April',
                    5 => 'Mei',
                    6 => 'Juni',
                    7 => 'Juli',
                    8 => 'Agustus',
                    9 => 'September',
                    10 => 'Oktober',
                    11 => 'November',
                    12 => 'Desember',
                ];
            @endphp
            @foreach ($bulanData as $bulan => $jumlah)
                <tr>
                    <td>{{ $bulanNames[$bulan] ?? 'Tidak Ada Data' }}</td>
                    <td>{{ $jumlah }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>

</html>