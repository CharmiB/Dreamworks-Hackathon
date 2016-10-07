
function Sparks(radius, x, y, z, vx, vy, vz, createTime, angle, life, color){

	if(typeof(radius)==='undefined') radius = 2;
	if(typeof(vx)==='undefined') vx = 5;
	if(typeof(vy)==='undefined') vy = -5;
	if(typeof(vz)==='undefined') vz = 0;
	//if(typeof(mass)==='undefined') mass = 2;
	if(typeof(angle)==='undefined') angle = Math.PI/4;
	if(typeof(life)==='undefined') life = 3;
	if(typeof(color)==='undefined') color = 0xffff00;           // yellow dirty fellow

	this.color = color;
	var sphereGeometry = new THREE.SphereGeometry(radius/70);
	var sphereMaterial = new THREE.ParticleBasicMaterial(
	{color: color,size: 0.5 });

	this.mesh = new THREE.Mesh(sphereGeometry,sphereMaterial);
	this.createTime = createTime;
	this.radius = radius;

	this.x = x;
	this.y = y;
	this.z = z;

	this.vx = vx;
	this.vy = vy;
	this.vz = vz;

	this.angle = angle;
	this.life = life;
	this.mesh.position.x = x;
	this.mesh.position.y = y;
	this.mesh.position.z = z;

}

Sparks.prototype = {
	get position(){
		return Vector3(this.mesh.position.x,this.mesh.position.y,this.mesh.position.z);
	},
	set position(pos){
		this.mesh.position.x = pos.x;
		this.mesh.position.y = pos.y;
		this.mesh.position.z = pos.z;
	},
	get velocity(){
		return Vector3(this.vx,this.vy,this.vz);
	},
	set velocity(vec){
		this.vx = vec.x;
		this.vy = vec.y;
		this.vz = vec.z;
	}
};
