import 'aframe';
import './components/namespaceList';
import './components/namespace';
import './components/thumbstickMovement';
import './styles/main.css';
import { stateManager } from './stateManager/stateManager.js';

stateManager.fetchNamespaces();
