//local

// export const base_url = "http://localhost:8050/v1";
// export const login_url = "http://localhost:8050/v1";

//production

export const base_url = "https://pos-tracker.geepay.tech/v1";
export const login_url = "https://pos-tracker.geepay.tech/v1";
export const domain_name = "postracker.mygeepay.com"
export const metaDataUrl = "https://postracker.mygeepay.com";

export const api_endpoints = {
    //auth
    login: `${login_url}/login`,

    //create
    createAppVersion: `${base_url}/app/version/register`,
    createUser: `${login_url}/create-user`,
    createBusiness: `${base_url}/business/create`,
    createApp: `${base_url}/app/register`,

    //Get
    getAppVersions: `${base_url}/app/versions/get`,
    getPosDevices: `${base_url}/pos/devices/get`,
    getBusinesses: `${base_url}/businesses/get`,
    getBusinessById: `${base_url}/business/get`,
    getApps: `${base_url}/apps/get`,
    getDashboardTileInfo: `${base_url}/dashboard/tiles/get`,
    getEvents: `${base_url}/dashboard/events/get`,
    getLocations: `${base_url}/locations/get`,
    getUserInfo: `${base_url}/user/get/`,
    getUsers: `${base_url}/users/get`,
    getTerminalTypes: `${base_url}/terminal-types/get`,

    //Update
    editPosDevice: `${base_url}/pos/device/update`,
    editAppVersion: `${base_url}/app/version/update`,
    editUser: `${base_url}/user/update`,
    editBusiness: `${base_url}/business/update`,
    editApp: `${base_url}/app/info/update`,

    //account self-service
    changePassword: `${base_url}/user/password/change`,
    changeEmail: `${base_url}/user/email/change`,

    //delete
    deleteUser: `${base_url}/user/delete`,
    deleteApp: `${base_url}/app`,
    deleteAppVersion: `${base_url}/app/version`,
    deletePosDevice: `${base_url}/pos/device`,
    deleteTerminalType: `${base_url}/terminal-type`,
    deleteBusiness: `${base_url}/business`,
    deleteLocation: `${base_url}/location`
};
