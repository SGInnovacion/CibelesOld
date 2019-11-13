const parseGeneralInfo = parcela => {
    return `
    ${parcela.ambitoDenominacion.includes('ZONA') ? '' : `
               <b>Parcela</b>
               <p>${parcela.ambitoDenominacion}</p>
                 `}
          
               <b>Superficie</b>
               <p>${
                    parcela.superficieCalculo.includes('---') ? parseFloat(parcela.superficieGIS).toFixed(2) :
                    parseFloat(parcela.superficieCalculo).toFixed(2)
                    } m<sup>2</sup></p>
               <b>Ámbito de ordenación</b>
               <p>${
                    parcela.ambitoDenominacion.includes('ZONA') ? parcela.ambitoDenominacion : 
                        (parcela.ambitoEtiqueta + ' ' + parcela.ambitoDenominacion)
                }</p>
               
              ${parcela.zonaUrbanistica.includes('---') ? '' : `
               <b>Zona urbanística</b>
               <p>${parcela.zonaUrbanistica}</p>
          `}
    `;
};

const parseMainUse = main => {
    return `
    <tr>
         <td>${main.usoDenominacion}</td>
         <td>${main.usoEdificabilidad} m<sup>2</sup></td>
    </tr>
    `;
};

const parseAPE = parcela => {

};

const parseFelipe = parcela => {

};

const parseVigente = vigente => {
    return `
    <div class="expediente">
     <div class="section-title">Expediente y planeamiento vigente (8)</div>
     <div class="expediente-info">
          <table class='exp-table' style="min-width: 60%">
                      <tr>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Número</b></th>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Denominación</b></th>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Fase</b></th>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Fecha</b></th>
                      </tr>
                      <tr>
                        <td>${vigente.numero}</td>
                        <td>${vigente.denominacion}</td>
                        <td>${vigente.fase}</td>
                        <td>${vigente.fechaAprobacion}</td>
                      </tr>
                      
          </table>
     </div>
</div>
    `;
}

const fillMail = (plan = '', address) => {
    console.log(Object.values(plan));
    console.log(plan);
    console.log('length: ')
    return `
   <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml">
<head>
     <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i,900,900i&display=swap" rel="stylesheet">
<title>Test Email Sample</title>
<body>
<div class="header">
     <span class='header-title'>Ficha urbanismo</span>
     <img class='logo' src="https://identidad.madrid.es/wp-content/uploads/2018/12/firma_madrid_blanco.png">
</div>
<div class="sub-header">
     Esta es toda la información urbanística que disponemos de ${address}
</div>

<div class="info">
<div class="general-info">
     <div class="section-title">Datos generales y usos cualificados</div>
     <div class="section-info">
          <div class="col-izda">
          ${parseGeneralInfo(plan.parcela)}
          </div>
          <div class="col-dcha">
               <table class='uses-table' style="width:100%">
                      <tr>
                        <th align="left" class='table-title' style="font-size: 1.3em;"><b>Principal: (5)</b></th>
                        <th></th>
                      </tr>
                      ${parseMainUse(plan.parcela.usos[0])}
               </table>
          </div>
     </div>
</div>
${plan.parcela.exptePlaneamientoVigente.length > 0 ? parseVigente(plan.parcela.exptePlaneamientoVigente): ''}


<div class="proteccion">
     <div class="section-title">Protección del patrimonio (13)</div>
     <table class='patr-table' style="width:100%">
                      <tr>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Catálogo</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Número</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Protección</b></th>

                      </tr>
                      <tr>
                        <td>SERVICIOS TERCIARIOS OFICINAS (6)</td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                      </tr>
                      <tr>
                        <td>SERVICIOS TERCIARIOS OFICINAS (6)</td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                      </tr>
                                            <tr>
                        <td>SERVICIOS TERCIARIOS OFICINAS (6)</td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                      </tr>
                      <tr>
                        <td>SERVICIOS TERCIARIOS OFICINAS (6)</td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                      </tr>
     </table>
</div>

<div class="patrimonio-cam">
     <div class="section-title">Patrimonio histórico de la Comunidad de Madrid (20)</div>
     <table class='cam-table' style="width:100%">
                      <tr>
                        <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Clase</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Categoría</b></th>
                         <th align="left" class='table-title' style="font-size: 1.3em;">
                             <b>Denominación</b></th>

                      </tr>
                      <tr>
                        <td>BIEN PROTEGIDO (21)</td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                        <td>(7)92.740,00 m<sup>2</sup></td>
                      </tr>

     </table>
</div>

<div class="historico">
     <div class="section-title">Histórico de expedientes (24)</div>
     <table class='historico-table' style="width:100%">
          <tr>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Número</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Denominación</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Fase</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Fecha</b></th>
          </tr>
          <tr>
               <td>BIEN PROTEGIDO (21)</td>
               <td>(7)92.740,00 m<sup>2</sup></td>
               <td>(7)92.740,00 m<sup>2</sup></td>
               <td>(7)92.740,00 m<sup>2</sup></td>
          </tr>
     </table>
</div>

<div class="planeamiento">
     <div class="section-title">Planeamiento (25)</div>
     <table class='planeamiento-table' style="width:100%">
          <tr>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Número</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Denominación</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Fase</b></th>
               <th align="left" class='table-title' style="font-size: 1.3em;">
                    <b>Fecha</b></th>
          </tr>
          <tr>
               <td>BIEN PROTEGIDO (21)</td>
               <td>(7)92.740,00 m<sup>2</sup></td>
               <td>(7)92.740,00 m<sup>2</sup></td>
               <td>(7)92.740,00 m<sup>2</sup></td>
          </tr>
     </table>
</div>
</div>

<div class="footer">
     <span class='header-title'>Ayuntaminto de Madrid</span>
     <img class='logo' src="https://identidad.madrid.es/wp-content/uploads/2018/12/firma_madrid_blanco.png">
</div>


</body>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
<style>
body{
     margin: 0;
     font-size: 14px;
     font-family: 'Lato', sans-serif;
    height:100% !important;
    margin:0 !important;
    padding:0 !important;
    width:100% !important;
}
.info{
     padding: 10px;
}
.header{
     display: flex;
     background-color: #003df6;
     justify-content: space-between;
     align-items: center;
     height: 5em;
     color: white;
     padding: 10px;
}
.sub-header{
     display: flex;
     background-color: black;
     justify-content: space-between;
     align-items: center;
     height: 2em;
     color: white;
     padding: 10px;
     font-size: 1em;
     margin-bottom: 15px;
}
.header-title{
     font-size: 1.5em;
}
.logo{
    height: 80%;
    object-fit: contain;
     max-width: 50%;
}
.general-info{
     padding: 10px;
}

.section-title{
     font-size: 1.5em;
     text-decoration: underline;
     margin-bottom: 10px;
}

.section-info{
     display: flex;
     flex-direction: row;
     padding: 10px;
     margin-bottom: 15px;
}

@media (max-width: 500px) {
     .section-info {
          flex-direction: column;
     }

     .col-izda{
          padding: 10px;
     }
}

.col-izda{
     flex:1 1;
}

.col-dcha{
     flex: 2 1;
}

.uses-table{
     background-color: #f5f5f5;
     flex: 1;
     padding: 10px;
}

.uses-table tr{
     line-height: 2em;
}
.table-title{
     font-size: 1.3em;
     line-height: 2em;
}

.exp-table{
     padding-left: 10px;
     margin-bottom: 15px;
}

.expediente{
     padding: 10px;
}

.proteccion{
     background-color: #003df6;
     padding: 20px;
     color: white;
     margin: 10px;
}

.patrimonio-cam{
     background-color: #eef2ff;
     padding: 20px;
     color: black;
     margin: 10px;
}

.historico{
     padding: 10px;
}

.planeamiento{
     padding: 10px;
}

.footer{
     display: flex;
     background-color: #003df6;
     justify-content: space-between;
     align-items: center;
     height: 3em;
     color: white;
     padding: 20px;
}

</style>
</head>
    `;
};

module.exports = { fillMail };
