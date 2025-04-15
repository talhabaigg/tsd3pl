<!DOCTYPE html>
<html>

<head>
    <title>You Have Issues to Review</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f4f4f4;
            padding: 20px;
            color: #333;
        }

        .container {
            max-width: 600px;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: auto;
        }

        h2 {
            color: #333;
            text-align: center;
        }

        p {
            font-size: 16px;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }

        th {
            background-color: #008080;
            color: #fff;
        }

        tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .btn {
            display: inline-block;
            padding: 8px 12px;
            background-color: #008080;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
            font-size: 14px;
        }

        .btn:hover {
            background-color: #2f73f0;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
    </style>
</head>

<body>

    <div class="container">
        <h2>Your Weekly Issues Reminder</h2>

        <p>Hello,</p>
        @if ($newIssueCount > 0) 
        <p>{{$newIssueCount}} New issue(s) reported last week:</p>
        <table>
            <thead>
                <tr>
                    <th>Issue Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($newIssues as $issue)
                    <tr>
                        <td>{{ $issue->title }}</td>
                        <td>{{ $issue->status }}</td>
                        <td><a href="{{ route('issue.show', $issue->id) }}" class="btn">View</a></td>
                    </tr>
                @endforeach
            </tbody>
            </table>
            @endif
            <br>
            @if ($issueCount > 0)
        <p><strong>{{ $issueCount }}</strong> company issue(s) from previous weeks to review:</p>
 
        <table>
            <thead>
                <tr>
                    <th>Issue Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($issues as $issue)
                    <tr>
                        <td>{{ $issue->title }}</td>
                        <td>{{ $issue->status }}</td>
                        <td><a href="{{ route('issue.show', $issue->id) }}" class="btn">View</a></td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        @endif
<br>

@if ($deletedIssueCount > 0)
        <p>Additionally, {{ $deletedIssueCount }} company issue(s) were archived this week:</p>
        <table>
            <thead>
                <tr>
                    <th>Issue Name</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($deletedIssues as $issue)
                    <tr>
                        <td>{{ $issue->title }}</td>
                        <td>{{ $issue->status }}</td>
                        <td><a href="{{ route('issue.show', $issue->id) }}" class="btn">View</a></td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <br>
@endif


        <a href="{{ route('issue.index') }}" class="btn">Go to Issues log</a>
    </div>

</body>

</html>
