/* =========================================
   ЦЕНТР СВЕТА
   Основной JavaScript
========================================= */


/* =========================================
   ЗАСТАВКА
========================================= */

function hideLoader() {

    const loader = document.getElementById("loader");

    if (!loader) {
        return;
    }

    loader.style.transition = "opacity 1s ease";
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";

    setTimeout(function () {

        if (loader && loader.parentNode) {
            loader.remove();
        }

    }, 1000);
}


/*
    Заставка будет показываться 4 секунды.
    После этого принудительно исчезнет.
*/

setTimeout(function () {
    hideLoader();
}, 4000);


/* =========================================
   ФОНОВЫЕ ЧАСТИЦЫ
========================================= */

const canvas = document.getElementById("backgroundCanvas");

if (canvas) {

    const ctx = canvas.getContext("2d");

    let particles = [];

    const particleCount = 80;
    const maxDistance = 140;


    function resizeCanvas() {

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

    }


    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);


    class Particle {

        constructor() {

            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (Math.random() - 0.5) * 0.25;
            this.vy = (Math.random() - 0.5) * 0.25;

            this.radius = Math.random() * 1.5 + 0.5;

        }


        update() {

            this.x += this.vx;
            this.y += this.vy;


            if (this.x < 0) {
                this.x = canvas.width;
            }

            if (this.x > canvas.width) {
                this.x = 0;
            }


            if (this.y < 0) {
                this.y = canvas.height;
            }

            if (this.y > canvas.height) {
                this.y = 0;
            }

        }


        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = "rgba(255,255,255,0.35)";

            ctx.fill();

        }

    }


    for (let i = 0; i < particleCount; i++) {

        particles.push(
            new Particle()
        );

    }


    function drawConnections() {

        for (let i = 0; i < particles.length; i++) {

            for (let j = i + 1; j < particles.length; j++) {

                const dx =
                    particles[i].x -
                    particles[j].x;

                const dy =
                    particles[i].y -
                    particles[j].y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);


                if (distance < maxDistance) {

                    const opacity =
                        1 - distance / maxDistance;

                    ctx.beginPath();

                    ctx.moveTo(
                        particles[i].x,
                        particles[i].y
                    );

                    ctx.lineTo(
                        particles[j].x,
                        particles[j].y
                    );

                    ctx.strokeStyle =
                        `rgba(255,255,255,${opacity * 0.08})`;

                    ctx.lineWidth = 1;

                    ctx.stroke();

                }

            }

        }

    }


    function animateBackground() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        particles.forEach(function (particle) {

            particle.update();
            particle.draw();

        });


        drawConnections();


        requestAnimationFrame(
            animateBackground
        );

    }


    animateBackground();

}


/* =========================================
   HEADER
========================================= */

const header =
    document.querySelector(".header");


window.addEventListener("scroll", function () {

    if (!header) {
        return;
    }


    if (window.scrollY > 50) {

        header.style.background =
            "rgba(5,5,5,0.85)";

    } else {

        header.style.background =
            "rgba(5,5,5,0.55)";

    }

});


/* =========================================
   АНИМАЦИЯ ПОЯВЛЕНИЯ БЛОКОВ
========================================= */

const animatedElements =
    document.querySelectorAll(
        ".category-card, .catalog-placeholder, .about-text, .contacts-box"
    );


const observer =
    new IntersectionObserver(

        function (entries) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.15
        }

    );


animatedElements.forEach(function (element) {

    element.style.opacity = "0";

    element.style.transform =
        "translateY(40px)";

    element.style.transition =
        "opacity .8s ease, transform .8s ease";

    observer.observe(element);

});


/* =========================================
   КАТЕГОРИИ — МИКРОАНИМАЦИЯ
========================================= */

const categoryCards =
    document.querySelectorAll(".category-card");


categoryCards.forEach(function (card) {

    card.addEventListener("mousemove", function (event) {

        const rect =
            card.getBoundingClientRect();

        const x =
            event.clientX - rect.left;

        const y =
            event.clientY - rect.top;


        const rotateX =
            ((y / rect.height) - 0.5) * -5;

        const rotateY =
            ((x / rect.width) - 0.5) * 5;


        card.style.transform =
            `translateY(-10px) perspective(600px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;

    });


    card.addEventListener("mouseleave", function () {

        card.style.transform = "";

    });

});