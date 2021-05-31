// import CryptoJS from './bower_components/crypto-js';
export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        await postFormDataAsJSON({ url, formData });
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {
    console.log(formData.entries())

    const plainFormData = Object.fromEntries(formData.entries());

    // console.log(await plainFormData.picture.text())
    if (plainFormData.picture !== undefined) {
        // console.log(plainFormData.picture.type)
        plainFormData.picture_type = plainFormData.picture.type
        var reader = new FileReader()
        reader.onload = async function(e) {

            plainFormData.picture = btoa(reader.result);

            const formDataJsonString = JSON.stringify(plainFormData);

            const fetchOptions = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                body: formDataJsonString,
            };

            const response = await fetch(url, fetchOptions);

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            return response.json();
        }
        reader.readAsBinaryString(plainFormData.picture)
    } else {
        console.log(plainFormData)

        const formDataJsonString = JSON.stringify(plainFormData);

        console.log(formDataJsonString)

        const fetchOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: formDataJsonString,
        };

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }

        return response.json();
    }
}