class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = {
            //List of namespace objects
            namespaces: [],
            //Used as requester when reserving namespaces
            username: "addrew",
            //Description of a namespace the user has requested
            description: {}
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

    describeNamespace(namespace) {
        fetch(`/api/firelink/namespace/describe/${namespace}`)
        .then(response => response.json())
        .then(description => {
            this.setDescription(description);
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

    setDescription(description) {
        this.state.description = description;
        this.dispatchEvent(new CustomEvent('descriptionChanged', { detail: description }));
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
