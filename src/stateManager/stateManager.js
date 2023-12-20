class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = {
            //List of namespace objects
            namespaces: [],
            //Used as requester when reserving namespaces
            username: "addrew",
        };
    }

    fetchNamespaces() {
        fetch('/api/firelink/namespace/list')
        .then(response => response.json())
        .then(namespaces => {
            this.setNamespaces(namespaces);
        })
        .catch(error => {
            new CustomEvent('error', { detail: error });
        });
    }

    fetchDescription(namespace) {
        fetch(`/api/firelink/namespace/describe/${namespace}`)
        .then(response => response.json())
        .then(responseJson => {
            console.log("responseJson", responseJson);
            this.dispatchEvent(new CustomEvent('descriptionFetched', { detail: {namespace: namespace, message: responseJson.message }}));
        })
        .catch(error => {
            new CustomEvent('error', { detail: error });
        });
    }

    releaseNamespace(namespace) {
        fetch(`/api/firelink/namespace/release`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                namespace: namespace,
            })
        })
        .then(response => response.json())
        .then(msg => {
            this.dispatchEvent(new CustomEvent('namespaceReleased', { detail: namespace }));
        })
        .catch(error => {
            new CustomEvent('error', { detail: error });
        });
    }

    reserveNamespace(namespace) {
        fetch(`/api/firelink/namespace/reserve`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requester: this.state.username,
                force: true
            })
        })
        .then(response => response.json())
        .then(msg => {
            this.dispatchEvent(new CustomEvent('namespaceReserved', { detail: msg.namespace }));
        })
        .catch(error => {
            new CustomEvent('error', { detail: error });
        });
    }

    setNamespaces(namespaces) {
        this.state.namespaces = namespaces;
        this.dispatchEvent(new CustomEvent('namespacesChanged', { detail: namespaces }));
    }

    getNamespaces() {
        return this.state.namespaces;
    }
}

export const stateManager = new StateManager();
