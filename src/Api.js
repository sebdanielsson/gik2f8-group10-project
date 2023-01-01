class Api {
    url = "";

    constructor(url) {
        this.url = url;
    }

    // Create
    async create(data) {
        const JSONData = JSON.stringify(data);

        const request = new Request(this.url, {
            method: "POST",
            body: JSONData,
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            const result = await fetch(request);
            const results_data = await result.json();
            return results_data;
        } catch (error) {
            return console.log("create()", error);
        }
    }

    // Read
    async getAll() {
        try {
            const response = await fetch(this.url);
            const results_data = await response.json();
            return results_data;
        } catch (error) {
            return console.log("getAll()", error);
        }
    }

    // Read one
    async get(id) {
        try {
            const response = await fetch(this.url + "/" + id);
            const results_data = await response.json();
            return results_data;
        } catch (error) {
            return console.log("get()", error);
        }
    }

    // Update
    async update(id, data) {
        const JSONData = JSON.stringify(data);

        const request = new Request(this.url + "/" + id, {
            method: "PUT",
            body: JSONData,
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            const result = await fetch(request);
            const results_data = await result.json();
            return results_data;
        } catch (error) {
            return console.log("update()", error);
        }
    }

    // Delete
    remove(id) {
        try {
            return fetch(this.url + "/" + id, {
                method: "DELETE",
            }).then((response) => response);
        } catch (error) {
            return console.log("remove()", error);
        }
    }
}
