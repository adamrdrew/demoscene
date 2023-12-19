class StateManager extends EventTarget {
    constructor() {
        super();
        this.state = {
            namespaces: [],
            username: "",
        };
    }

    fetchNamespaces() {
        fetch('/api/firelink/namespace/list')
            .then(response => response.json())
            .then(namespaces => {
                this.setNamespaces(namespaces);
            })
            .catch(error => console.error('Error fetching namespaces:', error));
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
