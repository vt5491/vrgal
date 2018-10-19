# Vrgal - A gallery of selected three.js examples in VR format.

An [online][aa8b9adb] gallery of three.js examples that have been transformed to enable full VR display and interaction.  This site strives to become a full VR portal to the [three.js examples](https://threejs.org/examples/) on-line directory.
![Wall of examples](src/assets/img/screen_shots/results_scene_controllers_screen_shot.png)
Fig. 1: VR Gallery "wall" of links with controllers.  At this outer level, the left hand is used for positioning the camera by "grabbing and pulling" and rotating by "gripping".  The right controller is used for selecting either a preview image, the source code, or activating the link itself via the raycaster.

  [aa8b9adb]: https://infinitewheelie.org/vrgal/main "online gallery"

![Preview popup](src/assets/img/screen_shots/results_scene_thumb_popup_screen_shot.png)
fig. 2: Popup of preview image upon raycaster hover.

![View Source Code](src/assets/img/screen_shots/results_scene_source_popup_screen_shot.png)
fig. 3: Popup of source code upon raycaster hover on  "View Soure" button.

![Lifted three.js Example with VR controllers](src/assets/img/screen_shots/three_js_vr_horse_screen_shot.png)
fig. 4: Lifted three.js example with VR Controllers for moving and rotating the camera.
## Introduction
The three.js graphics library has an extensive library of over 350 sample scripts illustrating the power, expressiveness, and speed of this popular graphics package.  Unfortunately, most of the examples predate the arrival of VR headsets such as the Oculus Rift and the HTC Vive, forcing one to explore them in the rather banal and boring format of a 2-d window, with simple keyboard movement, and  mouse clicks. Certainly this is not the best way to experience their true potential.  

Wouldn't it be nicer to experience these examples using full immersive VR?  Imagine seeing a life-size horse galloping in your living room in full VR.

VRGAL, using an [automated parsing algorithm](https://github.com/vt5491/vrgal/tree/master/src/app/vrize) , is able to "lift" or "vr-ize" a large percentage of these "flat" three.js examples to be VR compatible (with the goal of adding many more). Then, using an A-frame based front-end, VRGAL combines these examples into one common interface: a VR "gallery" with which to browse the library.

While this can useful to all interested users, it is hoped this will be especially useful for  game programmers.  To this end, VRGAL allows you to browse the source code of the lifted THREE.js scripts from within the app as well.  

### User Guide
#### Movement
Supports Oculus Rift and HTC Vive controllers.  Use the left "Hand" controller for movement, and the right laser controller for selecting.

Oculus Rift:
Move by doing a "full grab" (press Grip, Trigger, and X-Buton) and then "pulling".  Rotate by pressing the trigger button and then "swiveling":
![](src/assets/img/OculusControllerButtons.jpg)

HTC Vive:  
Move by grabbing the Trigger button and "pulling".  Rotate by pressing the grip button and then "swiveling".
![htc vive](src/assets/img/vive_button_chart_4.png)


### Motivation
As an amateur games programmer, one unfortunate fact of life I realized upon writing my first _real_ game was that _good enough_ was, well, not _good enough_.  This is not necessarily true for "standard" apps, where good enough _can_ be _good enough_.  This is because a standard app has some utility even if it's not perfect, especially if your app is doing something useful that saves people time.  

But games are different.  Games are not a necessity: they are a  luxury.  No one "has to" play your game: they have to _want_ to play it.  And since people only have a limited amount of time, and there's plenty of competition out there, why should anyone play your amateuristic, half-baked, non-polished game?  In short, the bar for _acceptable_ in games is much higher than for standard web apps.

As the game programmer, once you have the game mechanics in place, probably the best way to improve your game (literally and metaphorically) is to improve your game's aesthetics (look and feel). There are two way you can do this.  One is by mastering a tool like Blender to improve your scene visuals, and the other is to exploit some of the more advanced features in your graphics library, such as lighting and shaders. As a means toward the latter, a good way to do this is to browse and _study_ the [three.js examples library](https://threejs.org/examples/).

This was the situation I found myself in upon trying to improve my game's look and feel. Unfortunately, my motivation diminished when I realized I could only view the three.js examples in a flat 2-d format.  This form factor just didn't incentivize me, and perhaps more importantly, gave me no sense of what it would actually look like in VR.

Necessity is the mother of invention, so I investigated how difficult it would be to manually "lift" an example (my first example was [webg_geometry_cube.html](https://github.com/vt5491/vrgal/blob/master/src/assets/threejs-env/examples/vrize-webgl_geometry_cube.html)).  To my surprise, I realized that only a few modifications were actually necessary.  I then lifted five more examples before making any conclusions about the generality of the process.  Again, to my surprise, I was able to lift them using very much the same modifications as on the first example.  

While this was an interesting result, I sure wasn't about to manually lift all the 300 or so available webgl-enabled examples in the library. Instead, I created a simple [parser](https://github.com/vt5491/vrgal/blob/master/src/app/vrize/services/parser.service.ts) that would automate the process.  This would prove to be a valuable effort since I've already had to lift each example several times as I added capabilities (such as adding controller support).  

Note: the parser succeeds because almost all the three.js examples are written in a very similar format, and almost all use identical naming conventions (for instance the camera is almost always called *camera*, and the scene *scene*).  To parse and lift truly arbitrary examples (e.g. ones that are not in the examples library), would be a much more difficult task.

As of this writing, I've managed to lift about fifty examples with a success rate of about 67% (in short, I'm able to lift about 2 out of every 3 examples).

Think of the THREE.js examples library as a warehouse full of fine art paintings, of which there are some potential Picassos and Rembrandts, waiting for someone to come along and frame them (the equivalent of VR-lifting) and then hang them up somewhere.  

That's what VRGAL strives to be about.

## Code Base Overview
VRGAL is composed of an A-frame front-end client housed in an angular 6 SPA, a node-based admin server, a node/express proxy server, and a Rails 5 database server responsible for statistics and meta-data.

### Related
[vrize service repo](https://github.com/vt5491/vrize-service)
## Release History
2018-07-17: Alpha.
