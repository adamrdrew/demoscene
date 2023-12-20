import 'aframe';

import './components/namespaceList';
import './components/namespace';
import './components/thumbstickMovement';
import './components/releasebox';
import './components/reserveNamespace';
import './components/reflective';
import './components/objectField';
import './shaders/grid'
import './shaders/dynamicCircuit';
import './components/ground';
import './styles/main.css';
import { stateManager } from './stateManager/stateManager.js';

stateManager.fetchNamespaces();
