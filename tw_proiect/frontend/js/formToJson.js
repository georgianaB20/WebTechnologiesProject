export async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const url = form.action;

    try {
        const formData = new FormData(form);

        await postFormDataAsJSON({url, formData});
    } catch (error) {
        console.error(error);
    }
}

async function postFormDataAsJSON({ url, formData }) {
    const plainFormData = Object.fromEntries(formData.entries());

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

    if (!response.ok){
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }

    return response.json();
}
