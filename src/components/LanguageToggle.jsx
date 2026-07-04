import { useTranslation } from "react-i18next";

export default function LanguageToggle() {

    const { i18n } = useTranslation();

    const changeLanguage = (lang) => {

        i18n.changeLanguage(lang);

        localStorage.setItem("language", lang);

    };

    return (

        <div className="flex items-center bg-white rounded-full shadow-lg border overflow-hidden">

            <button

                onClick={() => changeLanguage("en")}

                className={`px-5 py-2 font-semibold transition ${
                    i18n.language.startsWith("en")
                        ? "bg-yellow-400 text-black"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                }`}

            >

                English

            </button>

            <button

                onClick={() => changeLanguage("kn")}

                className={`px-5 py-2 font-semibold transition ${
                    i18n.language.startsWith("kn")
                        ? "bg-yellow-400 text-black"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                }`}

            >

                ಕನ್ನಡ

            </button>

        </div>

    );

}