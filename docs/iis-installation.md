# IIS Installation

## Initial installation

### Prerequisites

The following is required to be installed on the windows server

- [iisnode](https://github.com/Azure/iisnode)
- [.NET 5 hosting bundle](https://dotnet.microsoft.com/download/dotnet/5.0)

### Steps

Create to Sites.
-> Backend
-> Frontend

Set the Application pool to unmanaged.

Import Applications into corresponding sites.

Setup environment variables. See [Configuration](#Configuration)

## Configuration

### Backend

| Key                                 | Description                                           |
| ----------------------------------- | ----------------------------------------------------- |
| ConnectionStrings:DefaultConnection | Database Connection String                            |
| FileDrive:CouponPath                | Filepath where to save images of print coupons        |
| FileDrive:LocationPath              | Filepath where to save images location tank drawings  |
| UniConta:ApiGuid                    | GUID for UniConta                                     |
| UniConta:ApiUser                    | Username for UniConta                                 |
| UniConta:ApiPass                    | Password for the user for UniConta                    |
| SampleData:SeedSampleData           | `true / false` if the database should use sample data |
| Tokens:Secret                       | Secret to encrypt tokens with                         |
| SuperUser:Username                  |                                                       |
| SuperUser:Password                  |                                                       |
| Hashing:Iterations                  | Number of times a password can be used                |

### Frontend

| Key                          | Description                                |
| ---------------------------- | ------------------------------------------ |
| BACKEND_URL                  | Full URL of the backend                    |
| NODE_TLS_REJECT_UNAUTHORIZED | `0 / 1` to reject self signed certificates |
