const { google } = require("googleapis")

export class GoogleService {
    // TODO! May need to do OAuth as currently code only support invite 

    private _scopes: string
    private _keyFile?: string
    protected client?: any
    protected auth?: any

    constructor({scopes, keyFile}: {scopes: string, keyFile?: string}) {
        this._keyFile = keyFile
        this._scopes = scopes
    }

    async loadCredential() {
        try {
            this.auth = new google.auth.GoogleAuth({
                keyFile: this._keyFile,
                scopes: this._scopes
            });
        
            this.client = await this.auth.getClient();

            if (!this.auth || !this.client) throw new Error("Unable to connect Google Services");
        } catch (err) {
            console.error(err)
        }
    }
}