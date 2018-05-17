# Vrgal - A gallery of selected three.js examples in VR format.

An online gallery of three.js examples that have been transformed to enable full VR display and interaction.  This site aspires to be the VR equivalent of the [three.js examples](https://threejs.org/examples/) on-line directory.
![Wall of examples](src/assets/img/screen_shots/results_scene_controllers_screen_shot.png)
Fig. 1: VR Gallery "wall" of links with controllers.  At this outer level, the left hand is used for positioning the camera by "grabbing and pulling" and rotating by "gripping".  The right controller is used for selecting either a preview image, the source code, or activating the link itself via the raycaster.

![Preview popup](src/assets/img/screen_shots/results_scene_thumb_popup_screen_shot.png)
fig. 2: Popup of preview image upon raycaster hover.

![View Source Code](src/assets/img/screen_shots/results_scene_source_popup_screen_shot.png)
fig. 3: Popup of source code upon raycaster hover on  "View Soure" button.

![Lifted three.js Example with VR controllers](src/assets/img/screen_shots/three_js_vr_horse_screen_shot.png)
fig. 4: Lifted three.js example with VR Controllers for moving and rotating the camera.
## Introduction
The three.js graphics library has an extensive library of over 350 sample scripts that illustrates the vast capability, expressiveness, and speed of this popular package.  Unfortunately, most of these examples pre-date the arrival of VR headsets such as the Oculus Rift, and the HTC Vive.  As a result, one is forced to explore these 3-d graphic gems in the rather banal iand disappointing form factor of a flat 2-d screen, and simple keyboard movement, and  mouse clicks -- certainly not the best way to appreciate these babies. How much cooler would it be to explore these pupppies using full VR immersion.  Imagine seeing a galloping horse running in the middle of your living room -- seeing the examples as they're really intended , in full-blown VR.

VRGAL, using an [automated parsing algorithm](https://github.com/vt5491/vrgal/tree/master/src/app/vrize)   is able to "lift" or "vr-ize" a large perecentage of the "flat" three.js examples to be VR compatible (with the goal of adding many more). All that is left to do is to have a full-VR interface that allows you to "glue" these examples into one seamless interface, and then you have a full-VR "museum" with which to exaplore the examples.   This app is the result.

While this can interesting for the casual user, it is also hoped this will be a useful tool for graphic programmers and game progorammers alike.  To this end, you can also browse the source code in VR as well.  

### Motivation
As a full-time professional software developer, and part-time amateur VR game programmer, one unfortunate fact of life I realized upon writing my first _real_ game is that _good enough_, is not _good enough_.  This is not necessarily true for "standard" apps where _good enough_ can be, well, _good enough_.  This is because a standard app has some utility even if it's not perfect, esp. if you're the only game in town.  

But games are different.  Games are optional.  No one "has to" play your game.  They have to want to.  And people only have a limited time to play games.  And since there's plenty of competition (let's face it, every programmer and their brother wants to be a games programmer ), why should anyone play your stupid, non-polished, half-baked game?  In short, the bar for acceptable in games in much higher than your standard workaday apps.

As a pure code-based programmer, probably the two best way to improve your game (literally and metaphorically) are by hiring a graphics artists (or learing yourself) to come up with more realistic meshes and other scene artifacts using a modeling tool such as Blender.  The other is to exploit some more advanced features of your graphics library, such as lighting and shaders. As a means toward this latter end, a good way to learn about the asthetics (rather than just the mechanics) of three.js is to browse and _study_ the three.js examples library.

Unfortunately, I found my motivation to browse the three.js examples  wane when I realized I could only do this with a simple flat screen.  This form factor just didn't give me the motivation, and just as importantly, a sense of what these would look like in VR.  Necessity is the mother of invention, so I investigated how difficult it would be to manually "lift" an example (my first example was [webg_geometry_cube.html](https://github.com/vt5491/vrgal/blob/master/src/assets/threejs-env/examples/vrize-webgl_geometry_cube.html)).  To my surprise, I realized that only a few modifcations were actually necessary.  I then further attempted to see if I could lift five more examples before reaching any conclusions about the generality of my method.  Again, To my surprise, I was able to lift five more using very much the same modifications as on the first example.  

While this was an intersting result, I sure wasn't about to manually lift all the 300 or so available webgl-enabled examples. Instead, I created a simple [parser](https://github.com/vt5491/vrgal/blob/master/src/app/vrize/services/parser.service.ts) so I could atuomate the process, which will prove to be a necessary requirement since in practice, I've already had to lift each example several times as I add capabilities to the lift (such as adding controller support).  Note: the parser succeeds because almost all the examples are written in a very similar format, and the use almost identical naming convetions (for instance the cameral is almost always called *camera*, and the scene *scene*).  To parse and lift any aritrary examples (e.g. ones that are not in the examples library), would be a much more difficult task.

So as of this writing, I've managed to lift about fifty examples with a success rate of about 67% (in short, I'm able to lift about 2 out of every 3 examples).

I liken the examples library be like have a warehouse full of fine art paintings -- some of which are Picassos and Rembrandts, just sitting there waiting for someone to put them in a frame (the equivalent of VR-lifting) and hang them up somewhere.  That's what VRGAL is.

## Code Base Overview
