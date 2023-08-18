/* const countryData = {
    "1": {
        country: "Estados Unidos",
        currencyCode: "USD",
        currencyName: "Dólares",
        currencySymbol: "$",
        timezone: "America/New_York"
    },
    "52": {
        country: "México",
        currencyCode: "MXN",
        currencyName: "Pesos Mexicanos",
        currencySymbol: "$",
        timezone: "America/Mexico_City"
    },
    "51": {
        country: "Perú",
        currencyCode: "PEN",
        currencyName: "Soles",
        currencySymbol: "S/",
        timezone: "America/Lima"
    },
    "54": {
        country: "Argentina",
        currencyCode: "ARS",
        currencyName: "Pesos Argentinos",
        currencySymbol: "$",
        timezone: "America/Argentina/Buenos_Aires"
    },
    "57": {
        country: "Colombia",
        currencyCode: "COP",
        currencyName: "Pesos Colombianos",
        currencySymbol: "$",
        timezone: "America/Bogota"
    },
    "58": {
        country: "Venezuela",
        currencyCode: "VES",
        currencyName: "Bolívares Soberanos",
        currencySymbol: "Bs.S",
        timezone: "America/Caracas"
    },
    "502": {
        country: "Guatemala",
        currencyCode: "GTQ",
        currencyName: "Quetzales",
        currencySymbol: "Q",
        timezone: "America/Guatemala"
    },
    "503": {
        country: "El Salvador",
        currencyCode: "USD",
        currencyName: "Dólares",
        currencySymbol: "$",
        timezone: "America/El_Salvador"
    },
    "504": {
        country: "Honduras",
        currencyCode: "HNL",
        currencyName: "Lempiras",
        currencySymbol: "L",
        timezone: "America/Tegucigalpa"
    },
    "505": {
        country: "Nicaragua",
        currencyCode: "NIO",
        currencyName: "Córdobas",
        currencySymbol: "C$",
        timezone: "America/Managua"
    },
    "506": {
        country: "Costa Rica",
        currencyCode: "CRC",
        currencyName: "Colones",
        currencySymbol: "₡",
        timezone: "America/Costa_Rica"
    },
    "507": {
        country: "Panamá",
        currencyCode: "PAB",
        currencyName: "Balboas",
        currencySymbol: "B/.",
        timezone: "America/Panama"
    },
    "591": {
        country: "Bolivia",
        currencyCode: "BOB",
        currencyName: "Bolivianos",
        currencySymbol: "Bs.",
        timezone: "America/La_Paz"
    },
    "593": {
        country: "Ecuador",
        currencyCode: "USD",
        currencyName: "Dólares",
        currencySymbol: "$",
        timezone: "America/Guayaquil"
    },
    "595": {
        country: "Paraguay",
        currencyCode: "PYG",
        currencyName: "Guaraníes",
        currencySymbol: "₲",
        timezone: "America/Asuncion"
    },
    "598": {
        country: "Uruguay",
        currencyCode: "UYU",
        currencyName: "Pesos Uruguayos",
        currencySymbol: "$",
        timezone: "America/Montevideo"
    },
    "599": {
        country: "Curazao",
        currencyCode: "ANG",
        currencyName: "Guilder",
        currencySymbol: "ƒ",
        timezone: "America/Curacao"
    },
    "1787": {
        country: "Puerto Rico",
        currencyCode: "USD",
        currencyName: "Dólares",
        currencySymbol: "$",
        timezone: "America/Puerto_Rico"
    },
    "1809": {
        country: "República Dominicana",
        currencyCode: "DOP",
        currencyName: "Pesos Dominicanos",
        currencySymbol: "$",
        timezone: "America/Santo_Domingo"
    },
    "1829": {
        country: "República Dominicana",
        currencyCode: "DOP",
        currencyName: "Pesos Dominicanos",
        currencySymbol: "$",
        timezone: "America/Santo_Domingo"
    },
    "1849": {
        country: "República Dominicana",
        currencyCode: "DOP",
        currencyName: "Pesos Dominicanos",
        currencySymbol: "$",
        timezone: "America/Santo_Domingo"
    },
}; */

const countryData = {
    "AR": {
        country: "Argentina",
        currencyCode: "ARS",
        currencyName: "Pesos Argentinos",
        currencySymbol: "$",
        timezone: "America/Argentina/Buenos_Aires",
        countrycode: "54"
    },
    "BO": {
        country: "Bolivia",
        currencyCode: "BOB",
        currencyName: "Boliviano",
        currencySymbol: "Bs.",
        timezone: "America/La_Paz",
        countrycode: "591"
    },
    "BR": {
        country: "Brasil",
        currencyCode: "BRL",
        currencyName: "Reais",
        currencySymbol: "R$",
        timezone: "America/Sao_Paulo",
        countrycode: "55"
    },
    "BS": {
        country: "Bahamas",
        currencyCode: "BSD",
        currencyName: "Dólar Bahameño",
        currencySymbol: "$",
        timezone: "America/Nassau",
        countrycode: "1"
    },
    "CA": {
        country: "Canadá",
        currencyCode: "CAD",
        currencyName: "Dólar Canadiense",
        currencySymbol: "$",
        timezone: "America/Toronto",
        countrycode: "1"
    },
    "CL": {
        country: "Chile",
        currencyCode: "CLP",
        currencyName: "Peso Chileno",
        currencySymbol: "$",
        timezone: "America/Santiago",
        countrycode: "56"
    },
    "CO": {
        country: "Colombia",
        currencyCode: "COP",
        currencyName: "Peso Colombiano",
        currencySymbol: "$",
        timezone: "America/Bogota",
        countrycode: "57"
    },
    "CR": {
        country: "Costa Rica",
        currencyCode: "CRC",
        currencyName: "Colón Costarricense",
        currencySymbol: "₡",
        timezone: "America/Costa_Rica",
        countrycode: "506"
    },
    "CU": {
        country: "Cuba",
        currencyCode: "CUC",
        currencyName: "Peso Convertible",
        currencySymbol: "$",
        timezone: "America/Havana",
        countrycode: "53"
    },
    "DO": {
        country: "República Dominicana",
        currencyCode: "DOP",
        currencyName: "Peso Dominicano",
        currencySymbol: "$",
        timezone: "America/Santo_Domingo",
        countrycode: "1"
    },
    "EC": {
        country: "Ecuador",
        currencyCode: "USD",
        currencyName: "Dólar Estadounidense",
        currencySymbol: "$",
        timezone: "America/Guayaquil",
        countrycode: "593"
    },
    "GT": {
        country: "Guatemala",
        currencyCode: "GTQ",
        currencyName: "Quetzal",
        currencySymbol: "Q",
        timezone: "America/Guatemala",
        countrycode: "502"
    },
    "HN": {
        country: "Honduras",
        currencyCode: "HNL",
        currencyName: "Lempira",
        currencySymbol: "L",
        timezone: "America/Tegucigalpa",
        countrycode: "504"
    },
    "HT": {
        country: "Haití",
        currencyCode: "HTG",
        currencyName: "Gourde",
        currencySymbol: "G",
        timezone: "America/Port-au-Prince",
        countrycode: "509"
    },
    "JM": {
        country: "Jamaica",
        currencyCode: "JMD",
        currencyName: "Dólar Jamaiquino",
        currencySymbol: "$",
        timezone: "America/Jamaica",
        countrycode: "1"
    },
    "MX": {
        country: "México",
        currencyCode: "MXN",
        currencyName: "Peso Mexicano",
        currencySymbol: "$",
        timezone: "America/Mexico_City",
        countrycode: "52"
    },
    "NI": {
        country: "Nicaragua",
        currencyCode: "NIO",
        currencyName: "Córdoba",
        currencySymbol: "C$",
        timezone: "America/Managua",
        countrycode: "505"
    },
    "PA": {
        country: "Panamá",
        currencyCode: "PAB",
        currencyName: "Balboa",
        currencySymbol: "B/.",
        timezone: "America/Panama",
        countrycode: "507"
    },
    "PE": {
        country: "Perú",
        currencyCode: "PEN",
        currencyName: "Sol",
        currencySymbol: "S/",
        timezone: "America/Lima",
        countrycode: "51"
    },
    "PR": {
        country: "Puerto Rico",
        currencyCode: "USD",
        currencyName: "Dólar Estadounidense",
        currencySymbol: "$",
        timezone: "America/Puerto_Rico",
        countrycode: "1"
    },
    "PY": {
        country: "Paraguay",
        currencyCode: "PYG",
        currencyName: "Guaraní",
        currencySymbol: "₲",
        timezone: "America/Asuncion",
        countrycode: "595"
    },
    "SV": {
        country: "El Salvador",
        currencyCode: "USD",
        currencyName: "Dólar Estadounidense",
        currencySymbol: "$",
        timezone: "America/El_Salvador",
        countrycode: "503"
    },
    "TT": {
        country: "Trinidad y Tobago",
        currencyCode: "TTD",
        currencyName: "Dólar de Trinidad y Tobago",
        currencySymbol: "TT$",
        timezone: "America/Port_of_Spain",
        countrycode: "1"
    },
    "US": {
        country: "Estados Unidos",
        currencyCode: "USD",
        currencyName: "Dólar Estadounidense",
        currencySymbol: "$",
        timezone: "America/New_York",
        countrycode: "1"
    },
    "UY": {
        country: "Uruguay",
        currencyCode: "UYU",
        currencyName: "Peso Uruguayo",
        currencySymbol: "$",
        timezone: "America/Montevideo",
        countrycode: "598"
    },
    "VE": {
        country: "Venezuela",
        currencyCode: "VES",
        currencyName: "Bolívar Soberano",
        currencySymbol: "Bs.S",
        timezone: "America/Caracas",
        countrycode: "58"
    },
};


module.exports = countryData;