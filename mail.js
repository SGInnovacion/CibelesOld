const fillMail = (plan = '') => {
    return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml">
<head>
<link href="https://fonts.googleapis.com/css?family=Lato&display=swap" rel="stylesheet">

<title>Test Email Sample</title>
<body>
<div class="header">
<span class='header-title'>Ficha urbanismo</span>
<img class='logo' src="https://identidad.madrid.es/wp-content/uploads/2018/12/firma_madrid_blanco.png">
</div>
<div class="sub-header">
Esta es toda la información urbanística que disponemos de STREET_NAME
</div>

<div class="info">
<div class="general-info">
<div class="section-title">Datos generales y usos cualificados</div>
<div class="section-info">
<div class="col-izda">
<b>Parcela (1) </b>
<p>M08149_2</p>
<b>Superficie (2) </b>
<p>M08149_2</p>
<b>Ámbito de ordenación (3) </b>
<p>M08149_2</p>
<b>Zona urbanística (4) </b>
<p>M08149_2</p>
</div>
<div class="col-dcha">
<table class='uses-table' style="width:100%">
  <tr>
    <th align="left" class='table-title' style="font-size: 1.3em;"><b>Principal: (5)</b></th>
    <th></th> 
  </tr>
  <tr>
    <td>SERVICIOS TERCIARIOS OFICINAS (6)</td>
    <td>(7)92.740,00 m<sup>2</sup></td>
  </tr>
  <tr>
    <td>DOTACIONAL SERVICIOS COLECTIVOS</td>
    <td>Jackson</td>
  </tr>
  <tr>
   <td>RESIDENCIAL VIVIENDA COLECTIVA LIBRE</td>
    <td>68.493,42 m<sup>2</sup></td>
  </tr>
  <tr>
   <td>SERVICIOS TERCIARIOS HOSPEDAJE</td>
    <td>68.493,42 m<sup>2</sup></td>
  </tr>
  <tr>
   <td>SERVICIOS TERCIARIOS COMERCIAL</td>
    <td>30.118,00 m<sup>2</sup></td>
  </tr>
</table>
</div>
</div>
</div>

<div class="expediente">
<div class="section-title">Expediente y planeamiento vigente (8)</div>
</div>

<div class="proteccion">
<div class="section-title">Protección del patrimonio (13)</div>
</div>

<div class="patrimonio">
<div class="section-title">Patrimonio histórico de la Comunidad de Madrid (20)</div>
</div>
</div>



</body>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
<style>
body{
margin: 0;
font-size: 14px;
font-family: 'Lato', sans-serif;
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
}
.header-title{
font-size: 1.5em;
}
.logo{
    height: 80%;
    object-fit: contain;
}
.general-info{
}
.section-title{
font-size: 1.5em;
text-decoration: underline;
margin-bottom: 10px;
}

.section-info{
display: flex;
padding: 10px;
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

.proteccion{
background-color: #003df6;
padding: 10px;
color: white;
}

</style>
</head>
    `;
};

module.exports = { fillMail };
