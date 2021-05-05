export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        const responseData = await postFormDataAsJSON({url, formData});

        console.log(responseData);
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {
    console.log(formData.entries())

    const plainFormData = Object.fromEntries(formData.entries());

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

    if (!response.ok){
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}
