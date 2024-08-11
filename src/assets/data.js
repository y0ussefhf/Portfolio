import project2 from "./2.jpg"

export const data = {
    categories: [
        {
          smallname: "ARCH",
          name: "VIZ",
          image: "bg-[url('/src/assets/1.jpg')]"
        },
        {
          smallname: "INTERIOR",
          name: "DESIGN",
          image: "bg-[url('/src/assets/2.jpg')]"
        },
        {
          smallname: "ARCHITECTURAL",
          name: "DESIGN",
          image: "bg-[url('/src/assets/3.jpg')]"
        },
        {
          smallname: "AUTOMOTIVE",
          name: "DESIGN",
          image: "bg-[url('/src/assets/4.jpg')]"
        },
        {
          smallname: "ENVIRONMENT",
          name: "ART",
          image: "bg-[url('/src/assets/5.jpg')]"
        },
        {
          smallname: "CHARACTER",
          name: "ART",
          image: "bg-[url('/src/assets/6.jpg')]"
        },
        {
          smallname: "OTHER",
          name: "ART",
          image: "bg-[url('/src/assets/7.jpg')]"
        }
    ],
    "sections": [
        {
            "name": "ARCHVIZ",
            "projects": [
                {
                    name: "NEXUS",
                    description: "Graduation Project - Design and Visualisation",
                    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/91278c187319055.65859c7b46967.jpg",
                    link: "https://www.behance.net/gallery/187319055/Graduation-Project",
                    className: "lg:col-span-2 lg:row-span-2",
                    multipleImages: true,
                    secondImage: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/302dd9187319055.65859c7b4a385.jpg",
                    thirdImage: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/0764e5187319055.65859c7b4344e.jpg",
                    fourthImage: "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/eeba4e187319055.66b91d6583f9a.jpg"
                },
                {
                    name: "Housing Project",
                    description: "Housing Project - Design and Visualisation",
                    image: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/d7c8a9180302415.6508a0e5400b8.png",
                    link: "https://www.behance.net/gallery/180302415/Housing-Project-(Rework)",
                    className: "lg:row-span-2",
                    multipleImages: false
                },
   
            ]
        },
        {
            name: "INTERIOR DESIGN",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                    className: "col-span-3"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                }
            ]
        },
        {
            name: "ARCHITECTURAL DESIGN",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                    className: "col-span-3"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                }
            ]
        },
        {
            name: "AUTOMOTIVE DESIGN",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                    className: "col-span-3"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                }
            ]
        },
        {
            name: "ENVIRONMENT ART",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                    className: "col-span-3"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                }
            ]
        },
        {
            name: "CHARACTER ART",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                    className: "col-span-3"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                    className: "col-span-1"
                }
            ]
        },
        {
            name: "OTHER ART",
            projects: [
                {
                    name: "Project 1",
                    description: "Description 1",
                    image: "",
                    link: "https://www.google.com",
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                },
                {
                    name: "Project 2",
                    description: "Description 2",
                    image: project2,
                    link: "https://www.google.com",
                }
            ]
        }
    ]
}