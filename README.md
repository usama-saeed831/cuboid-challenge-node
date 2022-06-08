# cuboid-challenge-node
This API manages bags and cuboids. A cuboid is a three-dimensional rectangular box. Each face of a cuboid is a rectangle and adjacent faces meet at right angles. 
A cube is a cuboid with equal dimensions. A cuboid has a volume that is straightforward to calculate.
A bag is a malleable container with adjustable dimensions, but a fixed volume. 
The bag can expand to hold any shape or combination of shapes, but the volume of the bag is limited and cannot expand. 
In our model a bag has many cuboids.
This app has all complete test suite.

<h2>Setup </h2>
<ul>
<li>Use nvm to install the correct version of node:
    nvm install
</li>
<li>Copy .env.example to .env.
    cp .env.example .env
</li>
<li>Install packages.
  npm install
</li>
</ul>
<h2>Usage</h2>
<li>Run the app.
npm run dev
<li>Run the linter.
npm run lint
<li>Run the tests.
npm test</li>
