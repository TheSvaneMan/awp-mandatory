export default async function createPDF(params) {
    console.log(params);
    let pdf = { document: `
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="Content-Type" content="application/pdf">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <main>
                    <h1>Hello</h1>    
                </main>
            </body>
            </html>
    `}
    return pdf;
}