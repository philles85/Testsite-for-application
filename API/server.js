const allUsersRoute = new URLPattern({ pathname: "/allUsers" });

function readData() {
    const dataPath = "../data/users.json";
    return JSON.parse(Deno.readTextFile(dataPath));
}

function writeData(data) {
    const dataPath = "../data/users.json";
    Deno.writeTextFile(dataPath, JSON.stringify(data));
}


async function handler(request) {

    const url = new URL(request.url);

    const allUsersMatch = allUsersRoute.exec(url);


    const headerCORS = new Headers();
    headerCORS.set("Access-Control-Allow-Origin", "*");
    headerCORS.set("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    headerCORS.set("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: headerCORS });
    }

    async function userInfo() {
        const data = await fetch("https://dummyjson.com/users?limit=6&skip=0");
        const jsonData = await data.json();
        return jsonData;
    }

    if (allUsersMatch) {
        return new Response(JSON.stringify(await userInfo()), { headers: headerCORS, status: 200 })
    }
}




Deno.serve(handler);