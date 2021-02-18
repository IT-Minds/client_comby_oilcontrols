# IIS Installation

## Initial installation

### Prerequisites

To complete the application's installation on the windows server, the server must have the following dependencies installed:

- [iisnode](https://github.com/Azure/iisnode)
- [.NET 5 hosting bundle](https://dotnet.microsoft.com/download/dotnet/5.0)

### Steps

1. Create two Sites.
   -> Backend
   -> Frontend

2. Set the Application pool to unmanaged.

3. Import the zip file into the relative sites.

4. Setup environment variables. See [Configuration](#Configuration)

5. Restart both applications

## Updating the applications

Follow **only** step 3 from [Initial installation.](#Initial%20installation)

Beware: do not overwrite the site files unless you have a backup of all saved static content.

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
