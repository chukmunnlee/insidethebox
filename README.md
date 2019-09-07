# GeeksHacking Workshop - Dealing with Containerization

Organized by [GeeksHacking](geekshacking.com), the workshop is conducted by [@chukmunnlee](https://github.com/chukmunnlee) on 7th September 2019.

Check out [Chuk's Presentation Slides](https://docs.google.com/presentation/d/1A2VEWdGkDlWjTelwuTm2ylAfGrWjHCcKcGJLulW5K8I/edit#slide=id.g1c664736d2_0_248), and the [Event Details](https://www.eventbrite.sg/e/dealing-with-containerization-tickets-69258723707?fbclid=IwAR2EH8fy0P5qMR3ioclhm3sikaVQYtOx4vDfTiKjnNC_-OkVlOpygAYbcGo#) if you are curious to find out more about it!

These notes are contributed by [@lyqht](https://github.com/lyqht), a random participant who enjoyed the workshop.

## About the Repo

In this workshop, we will deploy two apps that can be found in this repo. A basic Fortune Cookie Web app in `/fortune` and a slightly more complicated Leisure Mobile app that has a database in `/frontend`+`/backend`+`/data`.

The finished dockerfiles and docker-compose.yml file for the two projects are located in their respective folders under `/deployments`. But the difficulty of this workshop is not reading what is in the docker related files, but running the docker commands appropriately and understanding what they do. ;)

## Table of Contents

- [GeeksHacking Workshop - Dealing with Containerization](#geekshacking-workshop---dealing-with-containerization)
  - [About the Repo](#about-the-repo)
  - [Table of Contents](#table-of-contents)
  - [Setup instructions](#setup-instructions)
    - [Deploying a remote VM Instance (UpCloud)](#deploying-a-remote-vm-instance-upcloud)
      - [Generate SSH Keys](#generate-ssh-keys)
      - [Choose a cloud service provider & choose an instance to deploy](#choose-a-cloud-service-provider--choose-an-instance-to-deploy)
    - [Creating and Running A Remote Docker Machine](#creating-and-running-a-remote-docker-machine)
      - [Login to Docker](#login-to-docker)
  - [Deploy the Fortune Cookie App](#deploy-the-fortune-cookie-app)
    - [Building the Docker Image for the App](#building-the-docker-image-for-the-app)
    - [Deploying the docker image](#deploying-the-docker-image)
    - [Cleaning up](#cleaning-up)
  - [Deploying the Leisure App](#deploying-the-leisure-app)
    - [Network & Volumes [not covered in detail]](#network--volumes-not-covered-in-detail)

## Setup instructions

Prepare an empty folder e.g. `docker_workshop` somewhere that will store this repository and the ssh keypair that you will be creating.

For basic docker setup, please refer to [GeeksHacking's manual](https://docs.google.com/document/d/1QcZz3mwv6y1FFM5wp3QHoJ_cDWzfYm179FdCZ_R7UNM/edit#heading=h.5ukxapb50vk7). 

### Deploying a remote VM Instance (UpCloud)

#### Generate SSH Keys

Before deploying an instance, you would need set up a ssh public & private keypair, to allow connection between your local machine and the remote instance. Open up your terminal and cd into `docker_workshop`, then create the keypair here with this command.

```bash
ssh-keygen
```

> The name of the keypair files are up to you.
> For the convenience of learning, don't put a password for now as it will shorten the commands that you need to type later on.

Two files will be produced with this command.

1. The private key is the file without any extension. 
2. The public key is the file with the `.pub` extension, and its contents are what you need to attach to the remote instance later on. To read the contents, open it up with a text editor/code editor or `echo SSH_KEY_NAME.pub` if you are in linux.

#### Choose a cloud service provider & choose an instance to deploy

For this workshop, the remote server is deployed via UpCloud, but you can use other cloud services as well so long as the capability of the instance meets the minimum requirement for deploying the applications in this repository. 

The UpCloud instance's specs:

- Location: SG
- Plan: $10/mth (1cores, 2GB Memory, 50GB storage)
- Storage: VirtIO(default), MaxIOPS, 10GB
- OS: Ubuntu Server 18.04 LTS
- Optionals: IPv6 YES
- SSH_KEY: NOT PRIVATE, Click ADD NEW+ then copy and paste the contents that you saw earlier on in the public key.
- Initialization Script: NIL
- Hostname: whatever you want

Deploying takes a few minutes, after which you can obtain its IP address for connecting to it and visiting the web app that you have deployed later on. You will also be notified of the password to access the instance (not used in this workshop.)

To connect to a remote server instance, run this command in the terminal under `docker_workshop`

```bash
ssh root@94.237.78.166 -i SSH_KEY_NAME
```

You will see that your terminal prompt has changed to root@YOUR_INSTANCE_HOSTNAME.

To disconnect, key `exit` in the terminal.

### Creating and Running A Remote Docker Machine

Create a docker machine with the remote server's IP address and the public SSH Key that you attached to it.

```bash
docker-machine create \
    --driver generic \
    --generic-ip-address=YOUR_INSTANCE_IP_ADDRESS \
    --generic-ssh-key SSH_KEY_NAME mydockermachine
```

Then run the command below to see the configuration of your docker machine. You will also see there are 2 comments included in the output. The output you see will differ depending on your OS.

```bash
docker-machine env mydockermachine
```

Copy the last line comment without the `#` into the terminal. This is a command that will configure the shell to issue docker commands that you run in your local computer machine directly to the remote server.

#### Login to Docker

```bash
docker login
```

## Deploy the Fortune Cookie App

### Building the Docker Image for the App

Get a node.js image from [Docker Hub](hub.docker.com).

```bash
docker pull node:latest
```

After we downloaded the image, we can check for the list of images that our docker machine has.

```bash
docker images
```

This image will serve as the base image upon which we will add files that our web app requires. To add the files to the image, we will need to create a dockerfile in the  `/fortune` app folder.

For the dockerfile, please refer to `deployments/fortune/Dockerfile`. You can either copy line by line to understand what it is trying to do or just copy it over. After which, you can run a docker command inside the `/fortune` folder to build it. You can name the image anything, it is similar to naming a git repo.

```bash
docker build -t lyqht/fcookie:v1
```

> Please replace lyqht/fcookie with YOUR_DOCKER_USERNAME/YOUR_IMAGE_NAME. it's just an example.

To check if the build is successful, in addition to seeing the success message prompt, you can check the list of docker images again and see your newly created image.

### Deploying the docker image

For a github repo, for other computers/users to access your repo, you need to push it to a place that can host your repo. Likewise for docker images to be accessed by other instances, we will push the image to docker hub.

```bash
docker push DOCKER_USERNAME/IMAGE_NAME:v1
```

This step will fail if you are not logged in previously.

After you have pushed the docker image, you can check that your image is now on dockerhub.

Then, you can issue a docker command for the remote instance to start a container that runs the image.

```bash
docker run -d -p 80:3000 --name app1 DOCKER_USERNAME/IMAGE_NAME:v1
```

> 80:3000 refers to Mapping TCP port 80 in the container to port 3000 on the Docker host.

To check the list of docker containers

```bash
docker ps
```

Now, when you visit the public IP of your instance, you will see the Fortune Cookie Website!

### Cleaning up

You can stop an image from running.

```bash
docker stop IMAGE_ID_OR_NAME
```

But the image will still remain, as you check the list of images, including those that are inactive with `docker images -a`. If you don't require it anymore, you can remove it.

```bash
docker rmi IMAGE_ID_OR_NAME
```

If you're lazy to stop it before removing it run `docker rmi -f IMAGE_ID_OR_NAME`

Likewise for the container, if you do not require it anymore, you can remove it.

```bash
docker rm CONTAINER_ID_OR_NAME
```

## Deploying the Leisure App

For the backend, an SQL Image is required (you can get from docker hub similarly as Nodejs) and a dockerfile needs to be created for the backend. You can refer to `/deployments/backend/Dockerfile` for it.

To build the image for the database... it's the same as building it for the fortune cookie app!

```bash
docker build -t lyqht/leisuredb:v1
```

Except this time we do not push this image alone, since the leisure app is not complete yet. We would need another `Dockerfile` and a `docker-compose.yml` to integrate the backend image with the frontend stuff. You can refer to `deployments/Dockerfile` and `deployments/docker-compose.yml` respectively. These files should be placed directly in the root folder of the repository.

> In `docker-compose.yml`, remember to change the name of the backend image to the one that you have created.

### Network & Volumes [not covered in detail]

As you navigate these files, you would see new terms such as network and volumes, and yes there also docker commands on how to create them! 

To create a network

```bash
docker network create appnet
```

To create a volume

```bash
docker volume create myvol
```

Attach a specified volume to a specified network for the backend image to run on.

```bash
docker run -d -p 3306:3306 --network mynet --volume myvol --name db lyqht/leisuredb:v1
```

> Unfortunately, the concepts of networks and volumes are not covered in detail for the workshop due to lack of time.

In the `docker-compose.yml`, You would also see that the files depend on a `config.json`, change the name of the existing `config_template.json` to match. After you are done, you can compose the build from the root folder.

```bash
docker-compose build
```

Now you can once again push the app and run it in a new container in your remote instance.

AND YOU'RE DONE~ :) Thanks Chuk for the great workshop.
