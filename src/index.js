import Movements from "./Movements.js";
import abi from "./abi/abi.json" assert { type: "json" };
import polygon from "./Web3.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry_area = new THREE.BoxGeometry(200, 0, 200);
const material_area = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const area = new THREE.Mesh(geometry_area, material_area);
scene.add(area);

camera.position.set(40, 200, 1);

const al = new THREE.AmbientLight(0xfffff1);
const dl = new THREE.DirectionalLight(0xfffff1);
al.add(dl);
scene.add(al);

function animate() {
  requestAnimationFrame(animate);

  if (Movements.isPressed(37)) {
    //left
    camera.position.x -= 0.5;
  }
  if (Movements.isPressed(38)) {
    //up
    camera.position.x += 0.5;
    camera.position.y += 0.5;
  }
  if (Movements.isPressed(39)) {
    //right
    camera.position.x += 0.5;
  }
  if (Movements.isPressed(40)) {
    //down
    camera.position.x -= 0.5;
    camera.position.y -= 0.5;
  }

  camera.lookAt(area.position);
  renderer.render(scene, camera);
}
animate();
renderer.render(scene, camera);

const button = document.querySelector("#mint");
button.addEventListener("click", mintNFT);

async function mintNFT() {
  let nft_name = document.querySelector("#nft_name").value;
  let nft_width = document.querySelector("#nft_width").value;
  let nft_height = document.querySelector("#nft_height").value;
  let nft_depth = document.querySelector("#nft_depth").value;
  let nft_x = document.querySelector("#nft_x").value;
  let nft_y = document.querySelector("#nft_y").value;
  let nft_z = document.querySelector("#nft_z").value;

  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask");
  }

  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0xe4c96035fb07cC0F3809c4b3CEDcf1d35c47E8E1"
  );

  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
      .send({
        from: accounts[0],
        value: "10",
      })
      .then((data) => {
        console.log("NFT is minted");
      });
  });
}

polygon.then((result) => {
  result.nft.forEach((object, index) => {
    if (index <= result.supply) {
      const geometry_cube = new THREE.BoxGeometry(object.w, object.h, object.d);
      const material_cube = new THREE.MeshPhongMaterial({ color: 0x73d4a });
      const nft = new THREE.Mesh(geometry_cube, material_cube);

      nft.position.set(object.x, object.y, object.z);
      scene.add(nft);
    }
  });
});

const setBg = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(15);
  const col = "0x" + randomColor;
  return col;
};
