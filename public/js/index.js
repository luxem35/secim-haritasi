function charConversion(string) {
    /**
     * Used to convert a string with Turkish characters
     * to English characters.
     * 
     * @argument string : string with turkish characters
     * @returns converted strings
     * 
     */

    var charMap = {Ç:'C',Ö:'O',Ş:'S',İ:'I',I:'i',Ü:'U',Ğ:'G',ç:'c',ö:'o',ş:'s',ı:'i',ü:'u',ğ:'g'};
    str_arr = string.toLowerCase().split('');

    for (var i=0; i < str_arr.length; i++) {
        str_arr[i] = charMap[ str_arr[i] ] || str_arr[i];
    }

    var convertedStr = str_arr.join('');
    convertedStr = convertedStr.replace(" ","").replace("-","").replace(/[^a-z0-9-.çöşüğı]/gi,"");
    
    return convertedStr;
}



const dataController =(function () {
    /**
     * Handles all background logic behind the application.
     * 
     * @returns addCity function expression
     * @returns getCity function expression
     * @returns testing function expression
     */

    var City = function (id, name, isMetropolitan, results) {
        this.id = id;
        this.name = name;
        this.isMetropolitan = isMetropolitan;
        this.results = results;
        this.totalVotes = -1;
    };

    City.prototype.getTotalVotes = function () {
        /**
         * Calculates total votes belonging to the city represented by 'this' object.
         * Assigns calculated value to 'totalVotes' value pair.
         * 
         * @extends City.prototype 
         */ 

        var totalVotes = 0;
        
        this.results.forEach(function (current) {
            totalVotes += parseInt(current.voteCount);
        });
        
        this.totalVotes = totalVotes;

        return totalVotes;
    };

    City.prototype.calcPercentages = function () {
        /**
         * Calculates percentages of individual 'results' object.
         * Assigns calculated values of each 'results' object's
         * 'percentage' value pair.
         * 
         * @extends City.prototype 
         */

        var percentage;
        var totalVotes = this.totalVotes;
        
        if (totalVotes > 0) {
            this.results.forEach(function (current) {

                percentage = (parseInt(current.voteCount) / totalVotes * 100).toFixed(2);
                current.percentage = percentage;
            });
        } else {
            console.error(`${this.name} has no votes registered!`);
        }

    };

    var allCities = [];

    return {
        
        addCity: function(cityData) {
            /**
             * Creates new instances of 'City'.
             * Adds new City instances to 'allCiities' array.
             * 
             * @argument Object { id, name, isMetropolitan, results }
             * @returns City newItem { id, name, isMetropolitan, results, totalVotes }
             */


            const { id, name, isMetropolitan, results } = cityData;

            var newItem = new City(id, name, isMetropolitan, results);

            newItem.getTotalVotes();
            
            newItem.calcPercentages();

            newItem.results.sort(function (a, b) {return b.percentage - a.percentage;});

            allCities.push(newItem);

            return newItem;
        },

        getCity: function (cityName) {
            /**
             * @argument String
             * @returns City object { id, name, isMetropolitan, results, totalVotes }
             */


            var city;
            allCities.forEach(function (current) {
                if (current.name == cityName) {
                    city = current;
                }
            });

            return city;
        },


        getAllData: function () {
            /**
             * Get method for all city data
             * 
             * @returns Object Array
             */

            const allData = allCities;
            return allData;
        },


        testing: function() {
            console.log(allCities);
        }
    };

}) ();








const UIController = (function () {
    // Controls changes in the UI
    var DOMstrings = {
        partyPrefixColor: {
            "AK Parti": "akp__color",
            BBP: "bbp__color",
            BTP: "btp__color",
            CHP: "chp__color",
            DP: "dp__color",
            DSP: "dsp__color",
            "İyi Parti": "iyi-parti__color",
            MHP: "mhp__color",
            HDP: "hdp__color",
            "Saadet Partisi": "saadet-partisi__color",
            TKP: "tkp__color",
            "Vatan Partisi": "vatan-partisi__color",
        }
        };
        

        return {
            setCityColor: function (city) {
                /**
                 * Changes color of the path tag under the parenting g tag  with a color prefixed by CSS values.
                 * @argument Object
                 */

                const { name, results }  = city;

                var convertedName = charConversion(name);

                var element = document.querySelector(`#${convertedName}`).firstElementChild;
                element.classList.add(DOMstrings.partyPrefixColor[results[0].name]);
                element.classList.remove("red");
                element.style.opacity = "1";
            },

            setCityHeat: function (city) {
                /**
                 * Changes color of the path tag under the parenting g tag  with red.
                 * Opacity of red = difference of percentages between 1st and 2nd place
                 * @argument Object
                 */

                const { name, results }  = city;
                var convertedName = charConversion(name);

                var firstPlace = parseInt (results[0].percentage);
                var secondPlace = parseInt (results[1].percentage);


                const colorIntensity = firstPlace / (firstPlace + secondPlace);

                var element = document.querySelector(`#${convertedName}`).firstElementChild;
                element.classList.remove(DOMstrings.partyPrefixColor[results[0].name]);
                element.classList.add("red");
                
                element.style.opacity = `${colorIntensity}`;                

            },


            setPopup: function (city) {
                /**
                 * Initializes data on the popup window of the cities
                 * @argument Object
                 * @returns String
                 */

                const { name, results, totalVotes } = city;

                html = `
                    <div class="header">
                        <p class="popup__city-name">${name}</p>
                        </br>
                        <p>Toplam oy: ${totalVotes}</p>
                    </div>
                    <div class="popup__ranking">
                        <div class="popup__party ${DOMstrings.partyPrefixColor[results[0].name]}">
                            <p>${results[0].name}</p>
                            </br>
                            <p class="popup__party-percentage">\%${results[0].percentage}</p>
                        </div>
                        <div class="popup__party ${DOMstrings.partyPrefixColor[results[1].name]}">
                            <p>${results[1].name}</p>
                            </br>
                            <p class="popup__party-percentage">\%${results[1].percentage}</p>
                        </div>
                        <div class="popup__party ${DOMstrings.partyPrefixColor[results[2].name]}">
                            <p>${results[2].name}</p>
                            </br>
                            <p class="popup__party-percentage">\%${results[2].percentage}</p>
                        </div>
                        <div class="popup__party ${DOMstrings.partyPrefixColor[results[3].name]}">
                            <p>${results[3].name}</p>
                            </br>
                            <p class="popup__party-percentage">\%${results[3].percentage}</p>
                        </div>
                    </div>
                `;

                return html;
            }
        };
}) ();








const controller = (function (dataCtrl, UICtrl) {
    // Controls communication between data and UI controllers

    const element = document.querySelector('#svg-turkiye-haritasi');
    const info = document.querySelector('.il-isimleri');    
    var toggleSwitch = document.getElementById("toggle-switch");    
    var newCity;

    var toggleSwitchStateChange = function () {
        /**
         * Controls toggle switch state,
         * Updates colors of the cities depending on the state change
         * 
         * @requires dataController.getAllData
         */

        toggleSwitch.firstElementChild.classList.toggle("toggle-switch__button--active");
        toggleSwitch.firstElementChild.classList.toggle("toggle-switch__button");
        toggleSwitch.lastElementChild.classList.toggle("toggle-switch__button--active");
        toggleSwitch.lastElementChild.classList.toggle("toggle-switch__button");

        const allData = dataController.getAllData();
        if (toggleSwitch.firstElementChild.classList.contains("toggle-switch__button--active")) {
            allData.forEach(function (current) {
                UIController.setCityColor(current);
            });
        } else {
            allData.forEach(function (current) {
                UIController.setCityHeat(current);
            });
        }
    };


    var setupEventListeners = function() {
        element.addEventListener(
            'mouseover',
            function (event) {
                var cityName, cityObj;
                if (event.target.tagName === 'path' && event.target.parentNode.id !== 'guney-kibris') {
                    cityName = event.target.parentNode.getAttribute('data-iladi');
                    cityObj = dataController.getCity(cityName);

                    console.log(cityObj);

                    info.innerHTML = ['<div>',
                        UIController.setPopup(cityObj),
                        '</div>'
                    ].join('');
                }
            }
        );

        toggleSwitch.firstElementChild.addEventListener('click', toggleSwitchStateChange);
        toggleSwitch.lastElementChild.addEventListener('click', toggleSwitchStateChange);
    };
    
    
    // TODO: Import json data
    /**
     * Haven't worked with any data from local files
     * in Express, and moduler structure of Javascript yet.
     * 
     * Tested with the data below.
     */
    const data = [{"id":1,"name":"Adana","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"23252"},{"id":2,"name":"BTP","voteCount":"3202"},{"id":3,"name":"TKP","voteCount":"2568"},{"id":4,"name":"Vatan Partisi","voteCount":"6188"},{"id":7,"name":"CHP","voteCount":"655867"},{"id":10,"name":"MHP","voteCount":"523755"},{"id":13,"name":"DSP","voteCount":"6391"},{"id":109,"name":"CEM AKARSU","voteCount":"1669"}]},{"id":2,"name":"Adıyaman","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"34766"},{"id":2,"name":"BTP","voteCount":"256"},{"id":3,"name":"TKP","voteCount":"268"},{"id":4,"name":"Vatan Partisi","voteCount":"172"},{"id":8,"name":"AK Parti","voteCount":"65805"},{"id":10,"name":"MHP","voteCount":"6720"},{"id":11,"name":"İyi Parti","voteCount":"14678"},{"id":13,"name":"DSP","voteCount":"331"},{"id":187,"name":"AHMET ALAGÖZ","voteCount":"446"},{"id":188,"name":"GAFARİ KOPARAL","voteCount":"136"},{"id":189,"name":"ABDULKADİR TÜNÇMEN","voteCount":"63"}]},{"id":3,"name":"Afyonkarahisar","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"741"},{"id":2,"name":"BTP","voteCount":"67"},{"id":3,"name":"TKP","voteCount":"111"},{"id":4,"name":"Vatan Partisi","voteCount":"135"},{"id":8,"name":"AK Parti","voteCount":"54712"},{"id":10,"name":"MHP","voteCount":"20725"},{"id":11,"name":"İyi Parti","voteCount":"50562"},{"id":13,"name":"DSP","voteCount":"315"}]},{"id":4,"name":"Ağrı","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"949"},{"id":2,"name":"BTP","voteCount":"57"},{"id":3,"name":"TKP","voteCount":"64"},{"id":7,"name":"CHP","voteCount":"892"},{"id":8,"name":"AK Parti","voteCount":"25799"},{"id":11,"name":"İyi Parti","voteCount":"1227"},{"id":12,"name":"HDP","voteCount":"17240"},{"id":13,"name":"DSP","voteCount":"67"},{"id":196,"name":"ÖZCAN GÖK","voteCount":"44"},{"id":197,"name":"MEMET ÖLÇER","voteCount":"25"},{"id":198,"name":"BERAT GÖKÇE","voteCount":"63"}]},{"id":5,"name":"Amasya","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"546"},{"id":2,"name":"BTP","voteCount":"46"},{"id":3,"name":"TKP","voteCount":"53"},{"id":4,"name":"Vatan Partisi","voteCount":"42"},{"id":7,"name":"CHP","voteCount":"10887"},{"id":8,"name":"AK Parti","voteCount":"21597"},{"id":10,"name":"MHP","voteCount":"29847"},{"id":13,"name":"DSP","voteCount":"62"},{"id":200,"name":"ADEM ŞAHİN","voteCount":"43"}]},{"id":6,"name":"Ankara","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"34175"},{"id":2,"name":"BTP","voteCount":"5573"},{"id":3,"name":"TKP","voteCount":"4628"},{"id":4,"name":"Vatan Partisi","voteCount":"6764"},{"id":7,"name":"CHP","voteCount":"1662183"},{"id":8,"name":"AK Parti","voteCount":"1537694"},{"id":13,"name":"DSP","voteCount":"9698"},{"id":110,"name":"SABİT TEKİN","voteCount":"723"},{"id":111,"name":"MEHMET CERİT","voteCount":"440"},{"id":112,"name":"MERİÇ MEYDAN","voteCount":"504"},{"id":113,"name":"MEHMET HOŞOĞLU","voteCount":"612"},{"id":114,"name":"RECEP GÖKYER","voteCount":"415"}]},{"id":7,"name":"Antalya","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"13601"},{"id":2,"name":"BTP","voteCount":"2071"},{"id":3,"name":"TKP","voteCount":"2135"},{"id":4,"name":"Vatan Partisi","voteCount":"3711"},{"id":7,"name":"CHP","voteCount":"714301"},{"id":8,"name":"AK Parti","voteCount":"652880"},{"id":9,"name":"DP","voteCount":"8073"},{"id":13,"name":"DSP","voteCount":"13477"},{"id":115,"name":"BEKİR KARADAŞ","voteCount":"759"}]},{"id":8,"name":"Artvin","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"120"},{"id":2,"name":"BTP","voteCount":"154"},{"id":7,"name":"CHP","voteCount":"7162"},{"id":8,"name":"AK Parti","voteCount":"6077"},{"id":13,"name":"DSP","voteCount":"29"},{"id":224,"name":"MUSTAFA POLAT","voteCount":"512"}]},{"id":9,"name":"Aydın","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"5641"},{"id":2,"name":"BTP","voteCount":"1302"},{"id":3,"name":"TKP","voteCount":"1836"},{"id":4,"name":"Vatan Partisi","voteCount":"2890"},{"id":7,"name":"CHP","voteCount":"368791"},{"id":8,"name":"AK Parti","voteCount":"299056"},{"id":13,"name":"DSP","voteCount":"4188"}]},{"id":10,"name":"Balıkesir","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"7810"},{"id":2,"name":"BTP","voteCount":"2143"},{"id":3,"name":"TKP","voteCount":"1381"},{"id":4,"name":"Vatan Partisi","voteCount":"3709"},{"id":8,"name":"AK Parti","voteCount":"375253"},{"id":9,"name":"DP","voteCount":"12776"},{"id":11,"name":"İyi Parti","voteCount":"365196"},{"id":12,"name":"HDP","voteCount":"10195"},{"id":13,"name":"DSP","voteCount":"5880"},{"id":116,"name":"ŞUAYYİP ÇETİN","voteCount":"1069"}]},{"id":11,"name":"Bilecik","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"299"},{"id":2,"name":"BTP","voteCount":"49"},{"id":3,"name":"TKP","voteCount":"28"},{"id":4,"name":"Vatan Partisi","voteCount":"111"},{"id":5,"name":"BBP","voteCount":"1633"},{"id":7,"name":"CHP","voteCount":"16464"},{"id":8,"name":"AK Parti","voteCount":"13662"},{"id":9,"name":"DP","voteCount":"233"},{"id":13,"name":"DSP","voteCount":"33"}]},{"id":12,"name":"Bingöl","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1036"},{"id":2,"name":"BTP","voteCount":"37"},{"id":3,"name":"TKP","voteCount":"57"},{"id":5,"name":"BBP","voteCount":"197"},{"id":7,"name":"CHP","voteCount":"573"},{"id":8,"name":"AK Parti","voteCount":"18954"},{"id":10,"name":"MHP","voteCount":"13233"},{"id":12,"name":"HDP","voteCount":"14948"},{"id":13,"name":"DSP","voteCount":"65"}]},{"id":13,"name":"Bitlis","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"4359"},{"id":2,"name":"BTP","voteCount":"42"},{"id":3,"name":"TKP","voteCount":"48"},{"id":7,"name":"CHP","voteCount":"315"},{"id":8,"name":"AK Parti","voteCount":"10194"},{"id":9,"name":"DP","voteCount":"155"},{"id":11,"name":"İyi Parti","voteCount":"368"},{"id":12,"name":"HDP","voteCount":"7691"},{"id":13,"name":"DSP","voteCount":"98"}]},{"id":14,"name":"Bolu","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1488"},{"id":2,"name":"BTP","voteCount":"151"},{"id":3,"name":"TKP","voteCount":"118"},{"id":4,"name":"Vatan Partisi","voteCount":"311"},{"id":7,"name":"CHP","voteCount":"49697"},{"id":8,"name":"AK Parti","voteCount":"42179"},{"id":12,"name":"HDP","voteCount":"212"},{"id":13,"name":"DSP","voteCount":"132"}]},{"id":15,"name":"Burdur","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"804"},{"id":2,"name":"BTP","voteCount":"29"},{"id":3,"name":"TKP","voteCount":"64"},{"id":4,"name":"Vatan Partisi","voteCount":"259"},{"id":7,"name":"CHP","voteCount":"26515"},{"id":8,"name":"AK Parti","voteCount":"21929"},{"id":12,"name":"HDP","voteCount":"159"},{"id":13,"name":"DSP","voteCount":"139"}]},{"id":16,"name":"Bursa","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"32589"},{"id":2,"name":"BTP","voteCount":"3545"},{"id":3,"name":"TKP","voteCount":"1451"},{"id":4,"name":"Vatan Partisi","voteCount":"4170"},{"id":7,"name":"CHP","voteCount":"851360"},{"id":8,"name":"AK Parti","voteCount":"898292"},{"id":9,"name":"DP","voteCount":"11746"},{"id":13,"name":"DSP","voteCount":"5976"},{"id":117,"name":"OSMAN UĞUR","voteCount":"1255"}]},{"id":17,"name":"Çanakkale","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"582"},{"id":2,"name":"BTP","voteCount":"220"},{"id":3,"name":"TKP","voteCount":"262"},{"id":5,"name":"BBP","voteCount":"446"},{"id":7,"name":"CHP","voteCount":"46178"},{"id":8,"name":"AK Parti","voteCount":"27080"},{"id":13,"name":"DSP","voteCount":"279"},{"id":256,"name":"İLYAS TERZİ","voteCount":"990"}]},{"id":18,"name":"Çankırı","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"477"},{"id":2,"name":"BTP","voteCount":"33"},{"id":3,"name":"TKP","voteCount":"27"},{"id":4,"name":"Vatan Partisi","voteCount":"35"},{"id":7,"name":"CHP","voteCount":"1968"},{"id":8,"name":"AK Parti","voteCount":"16001"},{"id":10,"name":"MHP","voteCount":"19665"},{"id":11,"name":"İyi Parti","voteCount":"3579"},{"id":13,"name":"DSP","voteCount":"64"}]},{"id":19,"name":"Çorum","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1724"},{"id":2,"name":"BTP","voteCount":"139"},{"id":3,"name":"TKP","voteCount":"110"},{"id":4,"name":"Vatan Partisi","voteCount":"124"},{"id":7,"name":"CHP","voteCount":"54196"},{"id":8,"name":"AK Parti","voteCount":"63866"},{"id":10,"name":"MHP","voteCount":"24141"},{"id":11,"name":"İyi Parti","voteCount":"2797"},{"id":13,"name":"DSP","voteCount":"69"},{"id":264,"name":"MURAT KIRÇI","voteCount":"398"}]},{"id":20,"name":"Denizli","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"4955"},{"id":2,"name":"BTP","voteCount":"1768"},{"id":3,"name":"TKP","voteCount":"1015"},{"id":4,"name":"Vatan Partisi","voteCount":"2637"},{"id":8,"name":"AK Parti","voteCount":"321726"},{"id":9,"name":"DP","voteCount":"7224"},{"id":11,"name":"İyi Parti","voteCount":"279412"},{"id":12,"name":"HDP","voteCount":"8853"},{"id":13,"name":"DSP","voteCount":"4372"},{"id":118,"name":"MEHMET KIRGIZ","voteCount":"502"},{"id":119,"name":"MEHMET UĞUR TATAR","voteCount":"3844"}]},
    {"id":21,"name":"Diyarbakır","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"15789"},{"id":2,"name":"BTP","voteCount":"1425"},{"id":3,"name":"TKP","voteCount":"909"},{"id":4,"name":"Vatan Partisi","voteCount":"521"},{"id":7,"name":"CHP","voteCount":"14270"},{"id":8,"name":"AK Parti","voteCount":"241633"},{"id":12,"name":"HDP","voteCount":"490571"},{"id":13,"name":"DSP","voteCount":"4378"},{"id":120,"name":"HAMDUSENA ACUN","voteCount":"586"},{"id":121,"name":"SEBĞATULLAH SEYDAOĞLU","voteCount":"6265"},{"id":122,"name":"SAİT AYDOĞMUŞ","voteCount":"1173"},{"id":123,"name":"DAYLAN KARADAŞ","voteCount":"1703"},{"id":124,"name":"HASAN SANCAR","voteCount":"370"}]},{"id":22,"name":"Edirne","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2605"},{"id":2,"name":"BTP","voteCount":"7342"},{"id":3,"name":"TKP","voteCount":"379"},{"id":4,"name":"Vatan Partisi","voteCount":"220"},{"id":5,"name":"BBP","voteCount":"759"},{"id":7,"name":"CHP","voteCount":"42388"},{"id":8,"name":"AK Parti","voteCount":"38555"},{"id":9,"name":"DP","voteCount":"655"},{"id":12,"name":"HDP","voteCount":"1158"},{"id":13,"name":"DSP","voteCount":"410"}]},{"id":23,"name":"Elazığ","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"8630"},{"id":2,"name":"BTP","voteCount":"207"},{"id":3,"name":"TKP","voteCount":"206"},{"id":4,"name":"Vatan Partisi","voteCount":"326"},{"id":8,"name":"AK Parti","voteCount":"72908"},{"id":10,"name":"MHP","voteCount":"62216"},{"id":11,"name":"İyi Parti","voteCount":"30880"},{"id":12,"name":"HDP","voteCount":"5023"},{"id":13,"name":"DSP","voteCount":"167"}]},{"id":24,"name":"Erzincan","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"739"},{"id":2,"name":"BTP","voteCount":"38"},{"id":3,"name":"TKP","voteCount":"52"},{"id":4,"name":"Vatan Partisi","voteCount":"27"},{"id":5,"name":"BBP","voteCount":"276"},{"id":7,"name":"CHP","voteCount":"17457"},{"id":8,"name":"AK Parti","voteCount":"24959"},{"id":10,"name":"MHP","voteCount":"32036"},{"id":13,"name":"DSP","voteCount":"42"}]},{"id":25,"name":"Erzurum","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"8668"},{"id":2,"name":"BTP","voteCount":"1902"},{"id":3,"name":"TKP","voteCount":"629"},{"id":4,"name":"Vatan Partisi","voteCount":"620"},{"id":7,"name":"CHP","voteCount":"9378"},{"id":8,"name":"AK Parti","voteCount":"241742"},{"id":11,"name":"İyi Parti","voteCount":"97945"},{"id":12,"name":"HDP","voteCount":"23167"},{"id":13,"name":"DSP","voteCount":"866"}]},{"id":26,"name":"Eskişehir","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"6579"},{"id":2,"name":"BTP","voteCount":"872"},{"id":3,"name":"TKP","voteCount":"602"},{"id":4,"name":"Vatan Partisi","voteCount":"1162"},{"id":7,"name":"CHP","voteCount":"285687"},{"id":8,"name":"AK Parti","voteCount":"246579"},{"id":13,"name":"DSP","voteCount":"4296"},{"id":125,"name":"NURİ ERCAN TORTOP","voteCount":"488"}]},{"id":27,"name":"Gaziantep","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"17351"},{"id":2,"name":"BTP","voteCount":"4128"},{"id":3,"name":"TKP","voteCount":"2347"},{"id":4,"name":"Vatan Partisi","voteCount":"3177"},{"id":8,"name":"AK Parti","voteCount":"494905"},{"id":11,"name":"İyi Parti","voteCount":"150747"},{"id":13,"name":"DSP","voteCount":"240274"},{"id":126,"name":"HASAN ŞAHİN KARACAOĞLU","voteCount":"974"},{"id":127,"name":"MAHMUT KARALAR","voteCount":"2115"},{"id":128,"name":"SİBEL ALTINTAŞ","voteCount":"929"}]},{"id":28,"name":"Giresun","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1232"},{"id":2,"name":"BTP","voteCount":"147"},{"id":3,"name":"TKP","voteCount":"221"},{"id":7,"name":"CHP","voteCount":"30026"},{"id":8,"name":"AK Parti","voteCount":"30306"},{"id":13,"name":"DSP","voteCount":"120"}]},{"id":29,"name":"Gümüşhane","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"250"},{"id":2,"name":"BTP","voteCount":"29"},{"id":3,"name":"TKP","voteCount":"25"},{"id":7,"name":"CHP","voteCount":"1410"},{"id":8,"name":"AK Parti","voteCount":"9182"},{"id":10,"name":"MHP","voteCount":"5606"},{"id":11,"name":"İyi Parti","voteCount":"2142"},{"id":13,"name":"DSP","voteCount":"33"}]},{"id":30,"name":"Hakkari","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"143"},{"id":2,"name":"BTP","voteCount":"66"},{"id":3,"name":"TKP","voteCount":"36"},{"id":7,"name":"CHP","voteCount":"818"},{"id":8,"name":"AK Parti","voteCount":"10644"},{"id":11,"name":"İyi Parti","voteCount":"486"},{"id":12,"name":"HDP","voteCount":"19199"},{"id":13,"name":"DSP","voteCount":"119"},{"id":303,"name":"METİN TEKİN","voteCount":"504"}]},{"id":31,"name":"Hatay","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"7547"},{"id":2,"name":"BTP","voteCount":"1140"},{"id":3,"name":"TKP","voteCount":"818"},{"id":4,"name":"Vatan Partisi","voteCount":"1828"},{"id":7,"name":"CHP","voteCount":"490269"},{"id":8,"name":"AK Parti","voteCount":"380495"},{"id":13,"name":"DSP","voteCount":"6331"},{"id":129,"name":"NİHAT TAŞKIN","voteCount":"424"}]},{"id":32,"name":"Isparta","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1177"},{"id":2,"name":"BTP","voteCount":"200"},{"id":3,"name":"TKP","voteCount":"181"},{"id":4,"name":"Vatan Partisi","voteCount":"97"},{"id":5,"name":"BBP","voteCount":"356"},{"id":8,"name":"AK Parti","voteCount":"50394"},{"id":9,"name":"DP","voteCount":"473"},{"id":10,"name":"MHP","voteCount":"40801"},{"id":11,"name":"İyi Parti","voteCount":"38003"},{"id":13,"name":"DSP","voteCount":"177"},{"id":309,"name":"SERKAN AĞARLI","voteCount":"70"},{"id":310,"name":"MELİH KAHVECİ","voteCount":"560"}]},{"id":33,"name":"Mersin","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"7202"},{"id":2,"name":"BTP","voteCount":"1939"},{"id":3,"name":"TKP","voteCount":"2187"},{"id":4,"name":"Vatan Partisi","voteCount":"3998"},{"id":7,"name":"CHP","voteCount":"477015"},{"id":9,"name":"DP","voteCount":"127167"},{"id":10,"name":"MHP","voteCount":"433666"},{"id":13,"name":"DSP","voteCount":"4719"}]},{"id":34,"name":"İstanbul","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"103300"},{"id":2,"name":"BTP","voteCount":"27238"},{"id":3,"name":"TKP","voteCount":"10492"},{"id":4,"name":"Vatan Partisi","voteCount":"17377"},{"id":7,"name":"CHP","voteCount":"4171118"},{"id":8,"name":"AK Parti","voteCount":"4149656"},{"id":9,"name":"DP","voteCount":"22544"},{"id":13,"name":"DSP","voteCount":"30817"},{"id":130,"name":"ÖZGE AKMAN","voteCount":"2437"},{"id":131,"name":"DURSUNALİ BACIOĞLU","voteCount":"331"},{"id":132,"name":"VEDAT ÖZTÜRK","voteCount":"550"},{"id":133,"name":"HÜSEYİN KARABULUT","voteCount":"526"},{"id":134,"name":"AHMET ÇÖRDÜK","voteCount":"525"},{"id":135,"name":"MUHAMMET ALİ CANCA","voteCount":"578"},{"id":136,"name":"MEHMET YILDIZ","voteCount":"661"},{"id":137,"name":"GÜLDES ÖNKOYUN","voteCount":"444"},{"id":138,"name":"HASAN ATASOY TORUN","voteCount":"286"},{"id":139,"name":"MEMET ALİ AYDOĞMUŞ","voteCount":"256"},{"id":140,"name":"LÜTFÜ YILMAZ","voteCount":"905"},{"id":141,"name":"SEÇKİN İLKER","voteCount":"206"},{"id":142,"name":"HALEF ALP","voteCount":"329"},{"id":143,"name":"ÖZKAN MUSTAFA KÜÇÜKKURAL","voteCount":"332"},{"id":144,"name":"FATMA RAGİBE KANIKURU LOĞOĞLU","voteCount":"418"},{"id":145,"name":"HAZER ORUÇ KAYA","voteCount":"303"},{"id":146,"name":"BURHAN EROL","voteCount":"270"},{"id":147,"name":"DOĞAN DUMAN","voteCount":"2005"},{"id":148,"name":"AYSEL TEKEREK","voteCount":"1520"},{"id":149,"name":"ALİ RIZA KANSIZ","voteCount":"393"},{"id":150,"name":"ABDULCELİL GÜLAP","voteCount":"287"},{"id":151,"name":"ORUÇ KARACIK","voteCount":"190"},{"id":152,"name":"MEHMET CELAL BAYKARA","voteCount":"452"},{"id":153,"name":"BURAK KADIOĞLU","voteCount":"328"}]},{"id":35,"name":"İzmir","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"30179"},{"id":2,"name":"BTP","voteCount":"3958"},{"id":3,"name":"TKP","voteCount":"8061"},{"id":4,"name":"Vatan Partisi","voteCount":"8535"},{"id":7,"name":"CHP","voteCount":"1549693"},{"id":8,"name":"AK Parti","voteCount":"1032020"},{"id":9,"name":"DP","voteCount":"11369"},{"id":13,"name":"DSP","voteCount":"20528"},{"id":154,"name":"İBRAHİM DEMİR","voteCount":"951"},{"id":155,"name":"ALİ İHSAN ERDENİLGEN","voteCount":"412"},{"id":156,"name":"YALÇIN YANIK","voteCount":"646"},{"id":157,"name":"DENİZ TÜTMEZ","voteCount":"862"}]},{"id":36,"name":"Kars","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"221"},{"id":2,"name":"BTP","voteCount":"37"},{"id":3,"name":"TKP","voteCount":"38"},{"id":4,"name":"Vatan Partisi","voteCount":"121"},{"id":7,"name":"CHP","voteCount":"9128"},{"id":10,"name":"MHP","voteCount":"10954"},{"id":11,"name":"İyi Parti","voteCount":"920"},{"id":12,"name":"HDP","voteCount":"12192"},{"id":13,"name":"DSP","voteCount":"7613"}]},{"id":37,"name":"Kastamonu","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"411"},{"id":2,"name":"BTP","voteCount":"87"},{"id":3,"name":"TKP","voteCount":"74"},{"id":7,"name":"CHP","voteCount":"11226"},{"id":8,"name":"AK Parti","voteCount":"19091"},{"id":9,"name":"DP","voteCount":"180"},{"id":10,"name":"MHP","voteCount":"30621"},{"id":13,"name":"DSP","voteCount":"112"}]},
    {"id":38,"name":"Kayseri","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"21688"},{"id":2,"name":"BTP","voteCount":"4031"},{"id":3,"name":"TKP","voteCount":"1361"},{"id":4,"name":"Vatan Partisi","voteCount":"2380"},{"id":8,"name":"AK Parti","voteCount":"500621"},{"id":11,"name":"İyi Parti","voteCount":"248947"},{"id":12,"name":"HDP","voteCount":"4542"},{"id":13,"name":"DSP","voteCount":"3218"},{"id":158,"name":"EYLEM SARIOĞLU ASLANDOĞAN","voteCount":"1820"},{"id":159,"name":"SAİT NAZLI","voteCount":"1142"}]},{"id":39,"name":"Kırklareli","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"403"},{"id":2,"name":"BTP","voteCount":"1243"},{"id":3,"name":"TKP","voteCount":"83"},{"id":4,"name":"Vatan Partisi","voteCount":"138"},{"id":7,"name":"CHP","voteCount":"9674"},{"id":10,"name":"MHP","voteCount":"16928"},{"id":13,"name":"DSP","voteCount":"180"},{"id":377,"name":"MEHMET SİYAM KESİMOĞLU","voteCount":"17176"}]},{"id":40,"name":"Kırşehir","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"484"},{"id":2,"name":"BTP","voteCount":"30"},{"id":3,"name":"TKP","voteCount":"57"},{"id":4,"name":"Vatan Partisi","voteCount":"80"},{"id":7,"name":"CHP","voteCount":"32028"},{"id":8,"name":"AK Parti","voteCount":"27652"},{"id":10,"name":"MHP","voteCount":"11137"},{"id":13,"name":"DSP","voteCount":"45"}]},{"id":41,"name":"Kocaeli","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"54640"},{"id":2,"name":"BTP","voteCount":"4692"},{"id":3,"name":"TKP","voteCount":"3470"},{"id":4,"name":"Vatan Partisi","voteCount":"2983"},{"id":8,"name":"AK Parti","voteCount":"610350"},{"id":9,"name":"DP","voteCount":"6212"},{"id":11,"name":"İyi Parti","voteCount":"359010"},{"id":12,"name":"HDP","voteCount":"41851"},{"id":13,"name":"DSP","voteCount":"10875"},{"id":160,"name":"REYHAN BAŞARAN KOÇ","voteCount":"3135"},{"id":161,"name":"ERSOY KANDEMİR","voteCount":"1099"}]},{"id":42,"name":"Konya","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"50099"},{"id":2,"name":"BTP","voteCount":"8623"},{"id":3,"name":"TKP","voteCount":"3690"},{"id":4,"name":"Vatan Partisi","voteCount":"3423"},{"id":8,"name":"AK Parti","voteCount":"859115"},{"id":9,"name":"DP","voteCount":"5647"},{"id":11,"name":"İyi Parti","voteCount":"245997"},{"id":12,"name":"HDP","voteCount":"26589"},{"id":13,"name":"DSP","voteCount":"6486"},{"id":162,"name":"MUSTAFA VURAL","voteCount":"4655"},{"id":163,"name":"SELAHATTİN CİZRELİOĞLU","voteCount":"1886"},{"id":164,"name":"YILDIRIM AKYOL","voteCount":"1827"}]},{"id":43,"name":"Kütahya","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1874"},{"id":2,"name":"BTP","voteCount":"110"},{"id":3,"name":"TKP","voteCount":"92"},{"id":7,"name":"CHP","voteCount":"35357"},{"id":8,"name":"AK Parti","voteCount":"44513"},{"id":9,"name":"DP","voteCount":"541"},{"id":10,"name":"MHP","voteCount":"53393"},{"id":11,"name":"İyi Parti","voteCount":"2009"},{"id":13,"name":"DSP","voteCount":"136"}]},{"id":44,"name":"Malatya","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"23682"},{"id":2,"name":"BTP","voteCount":"1508"},{"id":3,"name":"TKP","voteCount":"626"},{"id":4,"name":"Vatan Partisi","voteCount":"618"},{"id":7,"name":"CHP","voteCount":"103690"},{"id":8,"name":"AK Parti","voteCount":"305588"},{"id":9,"name":"DP","voteCount":"1651"},{"id":12,"name":"HDP","voteCount":"6555"},{"id":13,"name":"DSP","voteCount":"1345"},{"id":165,"name":"ŞERİF DEMİREL","voteCount":"1029"}]},{"id":45,"name":"Manisa","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"10098"},{"id":2,"name":"BTP","voteCount":"4290"},{"id":3,"name":"TKP","voteCount":"2890"},{"id":4,"name":"Vatan Partisi","voteCount":"3858"},{"id":9,"name":"DP","voteCount":"12119"},{"id":10,"name":"MHP","voteCount":"460692"},{"id":11,"name":"İyi Parti","voteCount":"332210"},{"id":12,"name":"HDP","voteCount":"37915"},{"id":13,"name":"DSP","voteCount":"6625"},{"id":166,"name":"ERGÜN KARAOĞLU","voteCount":"2324"}]},{"id":46,"name":"Kahramanmaraş","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"13145"},{"id":2,"name":"BTP","voteCount":"5412"},{"id":3,"name":"TKP","voteCount":"888"},{"id":4,"name":"Vatan Partisi","voteCount":"1857"},{"id":7,"name":"CHP","voteCount":"170407"},{"id":8,"name":"AK Parti","voteCount":"422222"},{"id":13,"name":"DSP","voteCount":"7628"},{"id":167,"name":"ÖMER SOLAK","voteCount":"1746"},{"id":168,"name":"İRFAN FISTIK","voteCount":"1280"}]},{"id":47,"name":"Mardin","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"4258"},{"id":2,"name":"BTP","voteCount":"615"},{"id":3,"name":"TKP","voteCount":"399"},{"id":4,"name":"Vatan Partisi","voteCount":"154"},{"id":7,"name":"CHP","voteCount":"6781"},{"id":8,"name":"AK Parti","voteCount":"143060"},{"id":9,"name":"DP","voteCount":"1102"},{"id":11,"name":"İyi Parti","voteCount":"4078"},{"id":12,"name":"HDP","voteCount":"208854"},{"id":13,"name":"DSP","voteCount":"760"},{"id":169,"name":"ABDURRAHMAN UNCU","voteCount":"456"},{"id":170,"name":"ABDULKADIR DEMİR","voteCount":"817"}]},{"id":48,"name":"Muğla","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"3335"},{"id":2,"name":"BTP","voteCount":"18753"},{"id":3,"name":"TKP","voteCount":"1406"},{"id":4,"name":"Vatan Partisi","voteCount":"2100"},{"id":7,"name":"CHP","voteCount":"217476"},{"id":8,"name":"AK Parti","voteCount":"171621"},{"id":9,"name":"DP","voteCount":"22978"},{"id":13,"name":"DSP","voteCount":"5148"},{"id":171,"name":"MÜŞTEBA KARAMANOĞLU","voteCount":"2621"},{"id":172,"name":"BEHÇET SAATCI","voteCount":"158424"}]},{"id":49,"name":"Muş","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"486"},{"id":2,"name":"BTP","voteCount":"658"},{"id":3,"name":"TKP","voteCount":"39"},{"id":4,"name":"Vatan Partisi","voteCount":"60"},{"id":7,"name":"CHP","voteCount":"386"},{"id":8,"name":"AK Parti","voteCount":"15919"},{"id":12,"name":"HDP","voteCount":"15381"},{"id":13,"name":"DSP","voteCount":"166"},{"id":428,"name":"ALİ ZİVER ÇAKI","voteCount":"464"},{"id":429,"name":"ŞEREFETTİN YATCİ","voteCount":"12237"}]},{"id":50,"name":"Nevşehir","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1216"},{"id":2,"name":"BTP","voteCount":"45"},{"id":3,"name":"TKP","voteCount":"81"},{"id":5,"name":"BBP","voteCount":"771"},{"id":8,"name":"AK Parti","voteCount":"30024"},{"id":10,"name":"MHP","voteCount":"19983"},{"id":11,"name":"İyi Parti","voteCount":"5980"},{"id":13,"name":"DSP","voteCount":"112"}]},{"id":51,"name":"Niğde","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"857"},{"id":2,"name":"BTP","voteCount":"56"},{"id":3,"name":"TKP","voteCount":"51"},{"id":4,"name":"Vatan Partisi","voteCount":"97"},{"id":7,"name":"CHP","voteCount":"11029"},{"id":8,"name":"AK Parti","voteCount":"28032"},{"id":10,"name":"MHP","voteCount":"14019"},{"id":11,"name":"İyi Parti","voteCount":"21226"},{"id":13,"name":"DSP","voteCount":"56"},{"id":437,"name":"FİGEN ÜZER","voteCount":"67"}]},{"id":52,"name":"Ordu","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"124117"},{"id":2,"name":"BTP","voteCount":"1473"},{"id":3,"name":"TKP","voteCount":"902"},{"id":4,"name":"Vatan Partisi","voteCount":"1037"},{"id":7,"name":"CHP","voteCount":"73481"},{"id":8,"name":"AK Parti","voteCount":"270360"},{"id":9,"name":"DP","voteCount":"1336"},{"id":13,"name":"DSP","voteCount":"1788"},{"id":173,"name":"MURAT İSLAM","voteCount":"407"}]},{"id":53,"name":"Rize","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2715"},{"id":2,"name":"BTP","voteCount":"184"},{"id":3,"name":"TKP","voteCount":"155"},{"id":4,"name":"Vatan Partisi","voteCount":"136"},{"id":7,"name":"CHP","voteCount":"6536"},{"id":8,"name":"AK Parti","voteCount":"35761"},{"id":11,"name":"İyi Parti","voteCount":"3314"},{"id":13,"name":"DSP","voteCount":"196"}]},{"id":54,"name":"Sakarya","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"23108"},{"id":2,"name":"BTP","voteCount":"4245"},{"id":3,"name":"TKP","voteCount":"1137"},{"id":4,"name":"Vatan Partisi","voteCount":"1392"},{"id":8,"name":"AK Parti","voteCount":"386700"},{"id":9,"name":"DP","voteCount":"3346"},{"id":11,"name":"İyi Parti","voteCount":"164246"},{"id":12,"name":"HDP","voteCount":"6147"},{"id":13,"name":"DSP","voteCount":"2621"},{"id":174,"name":"MURAT TAKSİM","voteCount":"655"},{"id":175,"name":"MUSTAFA KAŞKAŞ","voteCount":"727"},{"id":176,"name":"SELİM ÇATALLAR","voteCount":"211"}]},{"id":55,"name":"Samsun","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"12323"},{"id":2,"name":"BTP","voteCount":"13437"},{"id":3,"name":"TKP","voteCount":"1638"},{"id":4,"name":"Vatan Partisi","voteCount":"1729"},{"id":8,"name":"AK Parti","voteCount":"379036"},{"id":9,"name":"DP","voteCount":"5334"},{"id":11,"name":"İyi Parti","voteCount":"213416"},{"id":13,"name":"DSP","voteCount":"4784"},{"id":177,"name":"ERHAN USTA","voteCount":"168474"}]},{"id":56,"name":"Siirt","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1003"},{"id":2,"name":"BTP","voteCount":"59"},{"id":3,"name":"TKP","voteCount":"95"},{"id":7,"name":"CHP","voteCount":"1330"},{"id":8,"name":"AK Parti","voteCount":"31611"},{"id":9,"name":"DP","voteCount":"128"},{"id":11,"name":"İyi Parti","voteCount":"1010"},{"id":12,"name":"HDP","voteCount":"33227"},{"id":13,"name":"DSP","voteCount":"242"}]},
    {"id":57,"name":"Sinop","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"306"},{"id":2,"name":"BTP","voteCount":"57"},{"id":3,"name":"TKP","voteCount":"38"},{"id":4,"name":"Vatan Partisi","voteCount":"43"},{"id":7,"name":"CHP","voteCount":"16609"},{"id":8,"name":"AK Parti","voteCount":"11877"},{"id":9,"name":"DP","voteCount":"61"},{"id":13,"name":"DSP","voteCount":"59"},{"id":459,"name":"METE ÇAĞDAŞ","voteCount":"280"}]},{"id":58,"name":"Sivas","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2806"},{"id":2,"name":"BTP","voteCount":"285"},{"id":3,"name":"TKP","voteCount":"117"},{"id":4,"name":"Vatan Partisi","voteCount":"150"},{"id":5,"name":"BBP","voteCount":"68900"},{"id":7,"name":"CHP","voteCount":"14528"},{"id":8,"name":"AK Parti","voteCount":"93284"},{"id":10,"name":"MHP","voteCount":"8913"},{"id":13,"name":"DSP","voteCount":"53"}]},{"id":59,"name":"Tekirdağ","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"6181"},{"id":2,"name":"BTP","voteCount":"920"},{"id":3,"name":"TKP","voteCount":"1044"},{"id":4,"name":"Vatan Partisi","voteCount":"1156"},{"id":7,"name":"CHP","voteCount":"318246"},{"id":8,"name":"AK Parti","voteCount":"272619"},{"id":9,"name":"DP","voteCount":"2373"},{"id":12,"name":"HDP","voteCount":"11708"},{"id":13,"name":"DSP","voteCount":"7009"},{"id":178,"name":"TUNCAY SAĞIROĞLU","voteCount":"518"}]},{"id":60,"name":"Tokat","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1740"},{"id":2,"name":"BTP","voteCount":"80"},{"id":3,"name":"TKP","voteCount":"163"},{"id":8,"name":"AK Parti","voteCount":"40581"},{"id":9,"name":"DP","voteCount":"168"},{"id":10,"name":"MHP","voteCount":"23297"},{"id":11,"name":"İyi Parti","voteCount":"17012"},{"id":13,"name":"DSP","voteCount":"111"}]},{"id":61,"name":"Trabzon","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"15502"},{"id":2,"name":"BTP","voteCount":"2821"},{"id":3,"name":"TKP","voteCount":"950"},{"id":4,"name":"Vatan Partisi","voteCount":"1335"},{"id":8,"name":"AK Parti","voteCount":"307167"},{"id":9,"name":"DP","voteCount":"3747"},{"id":11,"name":"İyi Parti","voteCount":"140421"},{"id":13,"name":"DSP","voteCount":"2117"},{"id":179,"name":"İBRAHİM TOPUZ","voteCount":"1391"}]},{"id":62,"name":"Tunceli","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"43"},{"id":2,"name":"BTP","voteCount":"53"},{"id":3,"name":"TKP","voteCount":"5887"},{"id":4,"name":"Vatan Partisi","voteCount":"24"},{"id":7,"name":"CHP","voteCount":"3699"},{"id":8,"name":"AK Parti","voteCount":"2526"},{"id":10,"name":"MHP","voteCount":"627"},{"id":12,"name":"HDP","voteCount":"5069"},{"id":13,"name":"DSP","voteCount":"39"}]},{"id":63,"name":"Şanlıurfa","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"308510"},{"id":2,"name":"BTP","voteCount":"6284"},{"id":3,"name":"TKP","voteCount":"2614"},{"id":4,"name":"Vatan Partisi","voteCount":"3327"},{"id":8,"name":"AK Parti","voteCount":"516202"},{"id":13,"name":"DSP","voteCount":"7843"},{"id":180,"name":"ÖMER FARUK YAPICIER","voteCount":"1711"},{"id":181,"name":"OSMAN YILDIRIM","voteCount":"2325"}]},{"id":64,"name":"Uşak","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1605"},{"id":2,"name":"BTP","voteCount":"174"},{"id":3,"name":"TKP","voteCount":"123"},{"id":4,"name":"Vatan Partisi","voteCount":"133"},{"id":7,"name":"CHP","voteCount":"13528"},{"id":8,"name":"AK Parti","voteCount":"50934"},{"id":9,"name":"DP","voteCount":"258"},{"id":10,"name":"MHP","voteCount":"14015"},{"id":11,"name":"İyi Parti","voteCount":"49172"},{"id":13,"name":"DSP","voteCount":"284"}]},{"id":65,"name":"Van","isMetropolitan":true,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"9081"},{"id":2,"name":"BTP","voteCount":"679"},{"id":3,"name":"TKP","voteCount":"728"},{"id":4,"name":"Vatan Partisi","voteCount":"448"},{"id":7,"name":"CHP","voteCount":"9191"},{"id":8,"name":"AK Parti","voteCount":"196040"},{"id":11,"name":"İyi Parti","voteCount":"5345"},{"id":12,"name":"HDP","voteCount":"260495"},{"id":13,"name":"DSP","voteCount":"1898"}]},{"id":66,"name":"Yozgat","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"243"},{"id":2,"name":"BTP","voteCount":"788"},{"id":3,"name":"TKP","voteCount":"155"},{"id":8,"name":"AK Parti","voteCount":"18828"},{"id":9,"name":"DP","voteCount":"164"},{"id":10,"name":"MHP","voteCount":"7214"},{"id":11,"name":"İyi Parti","voteCount":"1641"},{"id":13,"name":"DSP","voteCount":"62"},{"id":491,"name":"BEKİR KORKMAZ","voteCount":"325"},{"id":492,"name":"KAZIM ARSLAN","voteCount":"16663"}]},{"id":67,"name":"Zonguldak","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1147"},{"id":2,"name":"BTP","voteCount":"57"},{"id":3,"name":"TKP","voteCount":"141"},{"id":7,"name":"CHP","voteCount":"23152"},{"id":8,"name":"AK Parti","voteCount":"25125"},{"id":9,"name":"DP","voteCount":"144"},{"id":10,"name":"MHP","voteCount":"8912"},{"id":13,"name":"DSP","voteCount":"417"}]},{"id":68,"name":"Aksaray","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"690"},{"id":2,"name":"BTP","voteCount":"228"},{"id":3,"name":"TKP","voteCount":"131"},{"id":4,"name":"Vatan Partisi","voteCount":"53"},{"id":5,"name":"BBP","voteCount":"477"},{"id":8,"name":"AK Parti","voteCount":"45253"},{"id":9,"name":"DP","voteCount":"268"},{"id":10,"name":"MHP","voteCount":"44015"},{"id":11,"name":"İyi Parti","voteCount":"20373"},{"id":13,"name":"DSP","voteCount":"194"},{"id":494,"name":"YAŞAR AR","voteCount":"130"}]},{"id":69,"name":"Bayburt","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"569"},{"id":2,"name":"BTP","voteCount":"14"},{"id":3,"name":"TKP","voteCount":"17"},{"id":7,"name":"CHP","voteCount":"329"},{"id":8,"name":"AK Parti","voteCount":"6905"},{"id":10,"name":"MHP","voteCount":"10911"},{"id":11,"name":"İyi Parti","voteCount":"519"},{"id":13,"name":"DSP","voteCount":"25"},{"id":495,"name":"MEHMET EMİR","voteCount":"26"}]},{"id":70,"name":"Karaman","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2096"},{"id":2,"name":"BTP","voteCount":"92"},{"id":3,"name":"TKP","voteCount":"100"},{"id":7,"name":"CHP","voteCount":"14685"},{"id":8,"name":"AK Parti","voteCount":"34842"},{"id":10,"name":"MHP","voteCount":"35893"},{"id":11,"name":"İyi Parti","voteCount":"2926"},{"id":13,"name":"DSP","voteCount":"67"}]},{"id":71,"name":"Kırıkkale","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"984"},{"id":2,"name":"BTP","voteCount":"71"},{"id":3,"name":"TKP","voteCount":"114"},{"id":4,"name":"Vatan Partisi","voteCount":"97"},{"id":5,"name":"BBP","voteCount":"1435"},{"id":8,"name":"AK Parti","voteCount":"45569"},{"id":10,"name":"MHP","voteCount":"25445"},{"id":11,"name":"İyi Parti","voteCount":"34391"},{"id":13,"name":"DSP","voteCount":"303"}]},{"id":72,"name":"Batman","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2712"},{"id":2,"name":"BTP","voteCount":"194"},{"id":3,"name":"TKP","voteCount":"185"},{"id":7,"name":"CHP","voteCount":"2575"},{"id":8,"name":"AK Parti","voteCount":"51902"},{"id":9,"name":"DP","voteCount":"339"},{"id":10,"name":"MHP","voteCount":"1180"},{"id":11,"name":"İyi Parti","voteCount":"1524"},{"id":12,"name":"HDP","voteCount":"120014"},{"id":13,"name":"DSP","voteCount":"412"},{"id":497,"name":"MEHMET FEYYAZ EKMEN","voteCount":"730"}]},{"id":73,"name":"Şırnak","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"270"},{"id":2,"name":"BTP","voteCount":"44"},{"id":3,"name":"TKP","voteCount":"54"},{"id":7,"name":"CHP","voteCount":"599"},{"id":8,"name":"AK Parti","voteCount":"19718"},{"id":12,"name":"HDP","voteCount":"11194"},{"id":13,"name":"DSP","voteCount":"67"}]},{"id":74,"name":"Bartın","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1053"},{"id":2,"name":"BTP","voteCount":"55"},{"id":3,"name":"TKP","voteCount":"62"},{"id":7,"name":"CHP","voteCount":"9977"},{"id":8,"name":"AK Parti","voteCount":"13855"},{"id":9,"name":"DP","voteCount":"66"},{"id":10,"name":"MHP","voteCount":"14024"},{"id":13,"name":"DSP","voteCount":"97"},{"id":502,"name":"SONER ÇETİN","voteCount":"32"}]},{"id":75,"name":"Ardahan","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"30"},{"id":2,"name":"BTP","voteCount":"9"},{"id":3,"name":"TKP","voteCount":"17"},{"id":4,"name":"Vatan Partisi","voteCount":"21"},{"id":7,"name":"CHP","voteCount":"5348"},{"id":8,"name":"AK Parti","voteCount":"4501"},{"id":11,"name":"İyi Parti","voteCount":"507"},{"id":13,"name":"DSP","voteCount":"12"}]},{"id":76,"name":"Iğdır","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"206"},{"id":2,"name":"BTP","voteCount":"54"},{"id":3,"name":"TKP","voteCount":"76"},{"id":7,"name":"CHP","voteCount":"1014"},{"id":10,"name":"MHP","voteCount":"20713"},{"id":12,"name":"HDP","voteCount":"22227"},{"id":13,"name":"DSP","voteCount":"78"}]},{"id":77,"name":"Yalova","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"935"},{"id":2,"name":"BTP","voteCount":"88"},{"id":3,"name":"TKP","voteCount":"65"},{"id":4,"name":"Vatan Partisi","voteCount":"222"},{"id":7,"name":"CHP","voteCount":"28796"},{"id":8,"name":"AK Parti","voteCount":"28183"},{"id":9,"name":"DP","voteCount":"3683"},{"id":12,"name":"HDP","voteCount":"560"},{"id":13,"name":"DSP","voteCount":"194"}]},
    {"id":78,"name":"Karabük","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"893"},{"id":2,"name":"BTP","voteCount":"134"},{"id":3,"name":"TKP","voteCount":"89"},{"id":5,"name":"BBP","voteCount":"687"},{"id":8,"name":"AK Parti","voteCount":"24874"},{"id":10,"name":"MHP","voteCount":"25429"},{"id":11,"name":"İyi Parti","voteCount":"11550"},{"id":13,"name":"DSP","voteCount":"192"}]},{"id":79,"name":"Kilis","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"1048"},{"id":2,"name":"BTP","voteCount":"254"},{"id":3,"name":"TKP","voteCount":"165"},{"id":8,"name":"AK Parti","voteCount":"23538"},{"id":10,"name":"MHP","voteCount":"16224"},{"id":11,"name":"İyi Parti","voteCount":"8403"},{"id":13,"name":"DSP","voteCount":"170"}]},{"id":80,"name":"Osmaniye","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"2010"},{"id":2,"name":"BTP","voteCount":"3112"},{"id":3,"name":"TKP","voteCount":"210"},{"id":9,"name":"DP","voteCount":"380"},{"id":10,"name":"MHP","voteCount":"61788"},{"id":11,"name":"İyi Parti","voteCount":"22344"},{"id":12,"name":"HDP","voteCount":"4125"},{"id":13,"name":"DSP","voteCount":"326"},{"id":504,"name":"KADİR KARAYEL","voteCount":"1551"},{"id":505,"name":"ALPASLAN KOCA","voteCount":"17644"}]},{"id":81,"name":"Düzce","isMetropolitan":false,"results":[{"id":1,"name":"Saadet Partisi","voteCount":"862"},{"id":2,"name":"BTP","voteCount":"162"},{"id":3,"name":"TKP","voteCount":"110"},{"id":4,"name":"Vatan Partisi","voteCount":"182"},{"id":5,"name":"BBP","voteCount":"503"},{"id":8,"name":"AK Parti","voteCount":"44299"},{"id":9,"name":"DP","voteCount":"469"},{"id":10,"name":"MHP","voteCount":"20443"},{"id":11,"name":"İyi Parti","voteCount":"26280"},{"id":13,"name":"DSP","voteCount":"226"},{"id":508,"name":"HASAN KALKAN","voteCount":"437"}]}]; 

        data.forEach(function (current) {
            newCity = dataController.addCity(current);
            UIController.setCityColor(newCity);
        });

    setupEventListeners();


}) (dataController, UIController);