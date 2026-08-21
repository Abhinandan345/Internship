"use strict";


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuButton =
    document.querySelector(".menu-toggle");

const navigation =
    document.querySelector(".nav-links");


if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {

        const isOpen =
            menuButton.getAttribute("aria-expanded")
            === "true";


        const nextState = !isOpen;


        menuButton.setAttribute(
            "aria-expanded",
            String(nextState)
        );


        menuButton.setAttribute(
            "aria-label",
            nextState
                ? "Close navigation menu"
                : "Open navigation menu"
        );


        navigation.setAttribute(
            "data-open",
            String(nextState)
        );

    });


    navigation
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );


                    navigation.setAttribute(
                        "data-open",
                        "false"
                    );

                }
            );

        });

}


/* =========================================================
   LIGHT / DARK THEME
   ========================================================= */

const themeButton =
    document.querySelector(".theme-toggle");


const savedTheme =
    localStorage.getItem("portfolio-theme");


const systemPrefersLight =
    window.matchMedia &&
    window.matchMedia(
        "(prefers-color-scheme: light)"
    ).matches;


const initialTheme =
    savedTheme ||
    (systemPrefersLight ? "light" : "dark");


document.documentElement.setAttribute(
    "data-theme",
    initialTheme
);


function updateThemeButton() {

    if (!themeButton) {
        return;
    }


    const currentTheme =
        document.documentElement
            .getAttribute("data-theme");


    const isLight =
        currentTheme === "light";


    themeButton.setAttribute(
        "aria-label",
        isLight
            ? "Switch to dark theme"
            : "Switch to light theme"
    );


    themeButton.setAttribute(
        "title",
        isLight
            ? "Switch to dark theme"
            : "Switch to light theme"
    );


    themeButton.textContent =
        isLight ? "☾" : "☀";

}


updateThemeButton();


if (themeButton) {

    themeButton.addEventListener(
        "click",
        () => {

            const currentTheme =
                document.documentElement
                    .getAttribute("data-theme");


            const newTheme =
                currentTheme === "light"
                    ? "dark"
                    : "light";


            document.documentElement
                .setAttribute(
                    "data-theme",
                    newTheme
                );


            localStorage.setItem(
                "portfolio-theme",
                newTheme
            );


            updateThemeButton();

        }
    );

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
    document.getElementById("contact-form");

const formStatus =
    document.getElementById("form-status");


if (contactForm && formStatus) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            if (!contactForm.checkValidity()) {

                contactForm.reportValidity();

                return;

            }


            formStatus.textContent =
                "Thank you. Your message has been submitted.";


            contactForm.reset();

        }
    );

}


/* =========================================================
   CURRENT YEAR
   ========================================================= */

document
    .querySelectorAll(".current-year")
    .forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });