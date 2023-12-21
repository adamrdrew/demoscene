# demoscene
#### A completely impractical VR interface for ephemeral environment management

*Note: This was a hackathon project. It was written in like 3 days. The code is like nuclear waste levels of bad. But it does work!*

You know how old movies from the 70s, 80s, and 90s visualized networks and computers with abstract and strange visuals? Think like the large glass boxes with code etched on them connected by tubes of light in Hackers, or the abstract neon cities of Tron. Film makers at that time were dealing with an audince unfamiliar with computers and networks so they needed to convey those concepts to the audience visually. Well I got to thinking "what if I tried to create an interface for a functional application that used that style?" So that's what this project is.

## Features
* Fully immersive VR web application
* Should be compatible with all headsets and platforms that support WebXR (except maybe controls, that's hard to say)
* Interacts with [firelink-backend](https://github.com/RedHatInsights/firelink-backend) to control ephemeral clusters running the [Ephemeral Namespace Operator](https://github.com/RedHatInsights/ephemeral-namespace-operator)
* Lists ephemeral namespaces on the cluster including reservation status and requester
* Describe namespaces for more information
* Reserve namespaces
* Release your reserved namespaces

## How it Works
demoscene is built with [A-Frame](https://aframe.io/) a Javascript library for building VR apps and games for the web. A-Frame acts as a rich high level API sitting on top of [Three.js](https://threejs.org/) which is a lower level 3D library that sits on top of the lower-level-still WebGL and then combines that with WebXR - the web standard for VR.

The app itself is an alternate frontend for Firelink, which is a web app for operating ephemeral enviroments. Just like the real [firelink-frontend](https://github.com/RedHatInsights/firelink-frontend) does, demoscene talks to the [firelink-backend](https://github.com/RedHatInsights/firelink-backend) which does the work of talking to a cluster running the ENO.

## Development Post Mortem
My original idea was to shim a VR interface with A-Frame into the already existing Firelink React app. Basically I'd add a new component to the React app and hook it up to the router, and then that component would use the app's existing data store to render A-Frame entities reactively. Sounded good, and at first it seemed to work. I was able to get a basic scene, and some boxes for ephemeral environments. However, things quickly went south.

A-Frame has its own component system, with its own lifecycle, and its own DOM management. Once I wanted to get more complex than just some boxes sitting in a skybox I ran into lots of problems. Finally I decided I needed to abandon that idea and write an A-Frame app from scratch, so that's what this app is.

I don't know what is idiomatic for A-Frame apps, I've never seen one aside from mine! So, I came up with this project structure that is heavily inspired by the standard create-react-app generated project. It should be pretty familiar. A-Frame components almost look like class components from something like Vue or React, but they are deceptively different. Things got confusing fast. Also, A-Frame code is very "web native", by which I mean it doesn't really provide things that the web standards already provide, so it heavily leverages things like elements, attributes, and events rather than higher level abstractions in javascript. That's cool, but it made things all the more unfamiliar for me. The result is code that is very side effecty, messy, and not well designed. But, by the end I started to get a feeling for how an A-Frame app might have been put together if I were to take a more serious try later.

Because I lost a day with the React experiment and another day just figuring out how to create the project and get started with A-Frame I only had like 2 or 3 days to develop this, so I was moving real fast. There's basically no error handling, and a lot of stuff is really wonky. I also didn't get to include any of the app related features (like deploys) I'd hoped. But still, it was a lot of fun and I learned a lot. I think I will try to do a VR project at home in A-Frame and see what I can do.

## Running the Project
You'll need to have [firelink-backend](https://github.com/RedHatInsights/firelink-backend) runnin on your system, as well as the Caddy dev-proxy that firelink-backend ships with. Check the firelink-backend README for info on that. You'll also need to be logged into an ephemeral cluster with oc or kubectl.

Once you've got the backend and proxy going you can start this app with `npm start`. You can then access the app in your browser at `127.0.0.1:8000` - that will be the proxy which will handle routing to the backend and frontend. 

To use the app on your VR Headset you will need to serve the app out over HTTPS - HTTPS is a hard requirement for WebXR. So, I used `ngrok` to handle that for me during development, but feel free to do whatever works for you.

## Thanks
[User Terminal](https://sketchfab.com/3d-models/user-terminal-c75bf05185054aacae878c60ba1ad75a) 3D model by [MRowa](https://sketchfab.com/MRowa) 