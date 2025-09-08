# SAPPER 3D

A 3D game written on Three.js.

## Game Description

The field of size X by Y consists of cubes. Some of them may contain mines.
Clicking on a cube leads to one of the following possible outcomes:

- There is no mine: the cube is replaced by a number representing
the number of mines around the cube.
- There is a mine: the player lost.

## Technical Aspects

- There is a possibility to choose 3 different field sizes before the game starts. Small: 7x7, medium: 14x14, large: 21x21.
- The game is in 3D space. Perspective Camera. Zoom-in and zoom-out.
