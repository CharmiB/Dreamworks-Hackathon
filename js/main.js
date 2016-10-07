// Set up three.js global variables
var scene, camera, renderer, container, loadingManager;
// Set up avatar global variables
var bbox;
// Transfer global variables
var i_share = 0, n_share = 1, i_delta = 0.0;

var particleArray;      //array to store particles
var totalParticles = 50;        //max number of particles

init();
animate();

// Sets up the scene.
function init()
{
    // Create the scene and set the scene size.
    scene = new THREE.Scene();

    particleArray = new Array();              // creates an array of the main particles
    splitArray = new Array();             /// creates an array of the split particles

    // keep a loading manager
    loadingManager = new THREE.LoadingManager();

    // Get container information
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    var WIDTH = window.innerWidth, HEIGHT = window.innerHeight; //in case rendering in body


    // Create a renderer and add it to the DOM.
    renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(WIDTH, HEIGHT);
    // Set the background color of the scene.
    renderer.setClearColor(0x333333, 1);
    //document.body.appendChild(renderer.domElement); //in case rendering in body
    container.appendChild( renderer.domElement );

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    camera = new THREE.PerspectiveCamera(45.0, WIDTH / HEIGHT, 0.01, 100);
    camera.position.set(-2, 2, -5);
    //camera.lookAt(new THREE.Vector3(5,0,0));
    scene.add(camera);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener('resize',
        function ()
        {
            var WIDTH = window.innerWidth, HEIGHT = window.innerHeight;
            renderer.setSize(WIDTH, HEIGHT);
            camera.aspect = WIDTH / HEIGHT;
            camera.updateProjectionMatrix();
        }
    );

    // Create a light, set its position, and add it to the scene.
    var alight = new THREE.AmbientLight(0xFFFFFF);
    alight.position.set(-100.0, 200.0, 100.0);
    scene.add(alight);

    // Load in the mesh and add it to the scene.
    var sawBlade_texPath = 'assets/sawblade.jpg';
    var sawBlade_objPath = 'assets/sawblade.obj';
    OBJMesh(sawBlade_objPath, sawBlade_texPath, "sawblade");

    var ground_texPath = 'assets/ground_tile.jpg';
    var ground_objPath = 'assets/ground.obj';
    OBJMesh(ground_objPath, ground_texPath, "ground");

    var slab_texPath = 'assets/slab.jpg';
    var slab_objPath = 'assets/slab.obj';
    OBJMesh(slab_objPath, slab_texPath, "slab");

    //Cube
    var cube_texPath = 'assets/rocky.jpg';
    var cube_objPath = 'assets/cube.obj';
    OBJMesh(cube_objPath, cube_texPath, "cube");



    // Add OrbitControls so that we can pan around with the mouse.
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.4;
    controls.userPanSpeed = 0.01;
    controls.userZoomSpeed = 0.01;
    controls.userRotateSpeed = 0.01;
    controls.minPolarAngle = -Math.PI/2;
    controls.maxPolarAngle = Math.PI/2;
    controls.minDistance = 0.01;
    controls.maxDistance = 30;


    clock = new THREE.Clock();
    var delta = clock.getDelta();
}

function animate()
{
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
            controls.update();
            postProcess();
            move();
}

function move(){                        // for overall motion
  moveMainParticles();
  moveSplitParticles();
}

function moveMainParticles(){                 // creation and motion happens here

    if (particleArray.length < totalParticles){
        createNewMainParticles(-0.25, 1.25, 0, Math.random()*1.25);
    }

    for (var i=0; i < particleArray.length; i++){             //making each particle follow the trajectory
        var particle = particleArray[i];
        modifyMainObject(particle,i);
        var presentTime = (new Date().getTime()-particle.createTime)*0.000125;
        moveMainObject(particle,presentTime);
    }
}


function createNewMainParticles(x, y, z, speed){                         // creates the main particles
    var angleArray = [10,5,1,2,3,8,13,16,17,19];
    var colorArray = ['#fdb813', '#e3fd13','#d6ce16', '#dfe120','#fdc413','#4516a3','#df8f15','#e1d920'];
    var randAngle = angleArray[Math.floor(Math.random() * angleArray.length)];
     var randColor = colorArray[Math.floor(Math.random() * colorArray.length)];

    var newParticle = new Sparks(2,x,y,z,-speed,speed,0,new Date().getTime(),randAngle,5,randColor);

    particleArray.push(newParticle);
    scene.add(newParticle.mesh);
}

function modifyMainObject(obj, i){                     //removes the particles from the maoin array

    if ( (obj.mesh.position.y < 0.15) ||  ((obj.mesh.position.y <= 1) && (obj.mesh.position.x <= -2.5)) || (obj.mesh.position.z  < 0.5 && obj.mesh.position.y <=1 && obj.mesh.position.x<= -2.5 && obj.mesh.position.x >=-3.5)) {
    //  obj.mesh.visible = false;   // make the particles invisible --- didn't work
        splitParticles(obj);
        removeObject(i);
        scene.remove(obj.mesh);
    }
}


function moveMainObject(obj,t){

    obj.mesh.position.x = obj.vx* Math.cos(Math.PI/180 *obj.angle)* t + obj.mesh.position.x;
    obj.mesh.position.y = obj.vy* Math.sin(Math.PI/180 * obj.angle)* t -(0.5 * 9.8 * t*t) + obj.mesh.position.y;
    obj.mesh.position.z = 0;
}

function splitParticles(obj){
   //var count = 0;
   //while(count < 2){

      //var xdirVel = Math.pow(-1,count) * (obj.vx/2);
      //var ydirVel = obj.vy/2;
      //console.log(xdirVel);
      createNewSplitParticles(obj.mesh.position.x,obj.mesh.position.y,0,obj.vx/2,obj.vy/2);    //new particle should be created
      createNewSplitParticles(obj.mesh.position.x,obj.mesh.position.y,0,-obj.vx/2,obj.vy/2);
      //count =  count + 1;
  //}
}
function createNewSplitParticles(x,y,z,speedOne,speedTwo){                  // creates the split particles
    var colorArray = ['#fdb813', '#e3fd13','#d6ce16'];
    var randColor = colorArray[Math.floor(Math.random() * colorArray.length)];

    var newParticle = new Sparks(1,x,y,z,speedOne,speedTwo,0,new Date().getTime(),Math.random()*30,5,randColor);
    splitArray.push(newParticle);
    scene.add(newParticle.mesh);
}


function moveSplitParticles(){                                           // move the split particles
      for (var i=0; i < splitArray.length; i++){             //making each particle follow the
          var presentTime = (new Date().getTime()-splitArray[i].createTime)* 0.000125;
          moveMainObject(splitArray[i],presentTime);

                if(splitArray[i].mesh.position.y < -0.1){         // to make the split particles after crossing the ground
                  splitArray[i].mesh.visible = false;
                }
          }
}

function removeObject(num){
    particleArray.splice(num,1);
}


function rotate(object, axis, radians)
{
    var rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.applyMatrix(rotObjectMatrix);
}
function translate(object, x, y, z)
{
    var transObjectMatrix = new THREE.Matrix4();
    transObjectMatrix.makeTranslation(x, y, z);
    object.applyMatrix(transObjectMatrix);
}
function postProcess()
{

    var delta = clock.getDelta();
    var asset = scene.getObjectByName( "sawblade" );

    translate(asset, 0,-1.5,0);
    rotate(asset, new THREE.Vector3(0,0,1), -9* delta); //rotate sawblade
    translate(asset, 0,1.5,0);


}


function OBJMesh(objpath, texpath, objName)
{
    var texture = new THREE.TextureLoader( loadingManager ).load(texpath, onLoad, onProgress, onError);
    var loader  = new THREE.OBJLoader( loadingManager ).load(objpath,
        function ( object )
        {
            object.traverse(
                function ( child )
                {
                    if(child instanceof THREE.Mesh)
                    {
                        child.material.map = texture;
                        child.material.needsUpdate = true;
                    }

                }
            );

            object.name = objName;
            //if(objName=="sawblade")
              //  translate(object, 0,1.5,0); //move it up to slab

            scene.add( object );
            onLoad( object );
        },
    onProgress, onError);
}

function onLoad( object )
{
    putText(0, "", 0, 0);
    i_share ++;
    if(i_share >= n_share)
        i_share = 0;
}

function onProgress( xhr )
{
    if ( xhr.lengthComputable )
    {
        var percentComplete = 100 * ((xhr.loaded / xhr.total) + i_share) / n_share;
        putText(0, Math.round(percentComplete, 2) + '%', 10, 10);
    }
}

function onError( xhr )
{
    putText(0, "Error", 10, 10);
}


function putText( divid, textStr, x, y )
{
    var text = document.getElementById("avatar_ftxt" + divid);
    text.innerHTML = textStr;
    text.style.left = x + 'px';
    text.style.top  = y + 'px';
}

function putTextExt(dividstr, textStr) //does not need init
{
    var text = document.getElementById(dividstr);
    text.innerHTML = textStr;
}
