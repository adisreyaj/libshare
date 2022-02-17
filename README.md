<br />
<p align="center">
  <a href="https://github.com/adi.sreyaj/compito">
    <img src="logo.png" alt="Logo" width="100" height="100">
  </a>

<h3 align="center">Lib Share</h3>

  <p align="center">
      Curate and share your favorite JavaScript libraries with other.
      <br />
      <br />
      <a href="https://libshare.adi.so">View Demo</a>
      ·
      <a href="https://github.com/adisreyaj/libshare-web/issues">Report Bug</a>
      ·
      <a href="https://github.com/adisreyaj/libshare-web/issues">Request Feature</a>
  </p>

  <p align="center">
   <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
   <img src="https://img.shields.io/badge/angular-%23DD0031.svg?style=for-the-badge&logo=angular&logoColor=white">
   <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
  </p>
</p>


![Libshare](libshare.jpeg)

Libshare helps you curate and share your favorite NPM libraries with the community. Showcase all the awesome libraries
that you used in your side project and give them visibility. Made for the ♥ of open-source.

## Tech Stack

The application UI is powered by **Anguar** and styling is all taken care using **Tailwind CSS**. There are no external component libraries used.

Surprisingly there is no dedicated server used in the making of this application. The whole API comprising of the server and the databse itself is hosted in **HarperDB**. Custom functions in HarperDB made this possible. So no worries about managing the server or the database.

## Running Locally
1. Clone or download the repo:
```sh
git clone https://github.com/adisreyaj/libshare.git
```
2. Navigate to the folder
```sh
cd libshare
```

3. Initialize the submodule
```sh
git submodule  update --init
```

4. Install the dependencies
```sh
npm install
```

5. Serve the UI
```sh
npm start
```

You can now visit http://localhost:4200 to see the application running.

## Links

- [Angular](https://angular.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [HarperDB](https://harperdb.io/)
- [ZigZag Component Library](https://github.com/adisreyaj/zigzag)
