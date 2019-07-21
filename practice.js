import React, { Component } from "react";
import {
    Stitch,
    AnonymousCredential,
    RemoteMongoClient
} from "mongodb-stitch-browser-sdk";
class App extends Component {
    constructor() {
        super();
        // ...
    }
    componentDidMount() {
        // Initialize the App Client
        this.client = Stitch.initializeDefaultAppClient("YOUR_APP_ID");
        // Get a MongoDB Service Client
        // This is used for logging in and communicating with Stitch
        const mongodb = this.client.getServiceClient(
            RemoteMongoClient.factory,
            "mongodb-atlas"
        );
        this.client.auth
            .loginWithCredential(new AnonymousCredential())
            .then(user => {
                console.log(Logged in as anonymous user with id: ${user.id});
            }).catch(console.error);
        // ...
    }
    render() { return ( <div className="App"></div> ); }
}
export default App;
