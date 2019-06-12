import React, { Component } from "react";
import { AnchorLink } from "@datawheel/canon-core";
import "./Home.css";
import Question from "../components/Question";
import Goal from "../components/Goal";
import { Icon, PopoverInteractionKind, Popover, InputGroup, Button, Toaster, Toast, Position, MenuItem } from "@blueprintjs/core";
import axios from "axios";
import { Select } from "@blueprintjs/select";

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      location: "",
      message: "",
      name: "",
      sector: "",
      subject: "Tengo una pregunta",
      showToast: false,
      isOpen: false,
      locations: [],
      locationsFilter: [],
      locationPivot: {},
      search: undefined
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelector = this.handleSelector.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

  }

  componentDidMount() {
    axios.get("/json/geo.json").then(resp => {
      const data = resp.data;
      const obj = [
        {depth: "country", name: "México", id: "mx", ent: 0},
        {depth: "country", name: "Otro país", id: "other", ent: 0}
      ];
      this.setState({locations: data, locationsFilter: obj});
    });
  }

  handleInputChange = e => {
    this.setState({search: e.target.value});
  };

  handleSelector = (state, value) => {
    this.setState({[state]: value});
  }

  handleSubmit = event => {
    event.preventDefault();
    // this.sendMessage()
    // 
    const formData = new FormData();
    formData.append("entry.1731643707", this.state.subject);
    formData.append("entry.1408300858", this.state.name);
    formData.append("entry.1418636752", this.state.sector);
    formData.append("entry.1552739115", this.state.location);
    formData.append("entry.406427322", this.state.message);
    formData.append("entry.1006716780", this.state.email);

    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const GOOGLE_FORM_ACTION_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeiFqDhq9q12JmUa9v9DvnDH7j07MdVeUtC3ZmV_01lf151KQ/formResponse";

    axios.post(CORS_PROXY + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.setState({
          email: "",
          location: "",
          message: "",
          name: "",
          sector: "",
          subject: "",
          showToast: true
        });
      }).catch(() => {
        console.log("ERROR");
      });

  }

  handleChange = (state, evt) => {
    evt.preventDefault();
    this.setState({[state]: evt.target.value});
  }

  handleLocation = d => {
    if (d.depth === "country" && d.id === "mx") {
      this.setState({
        locationsFilter: this.state.locations.filter(h => h.depth === "ent"),
        search: undefined
      });
    }
    else if (d.depth === "ent") {
      this.setState({
        locationsFilter: this.state.locations.filter(h => h.depth === "mun" && h.ent === d.ent),
        search: undefined
      });
    }
    else {
      this.setState({location: d.name, isOpen: false, locationPivot: d});
    }
  }

  backLocation = d => {
    if (d.depth === "mun") {
      this.setState({locationsFilter: this.state.locations.filter(h => h.depth === "ent")});
    }
    else if (d.depth === "ent") {
      const obj = [
        {depth: "country", name: "México", id: "mx", ent: 0},
        {depth: "country", name: "Otro país", id: "other", ent: 0}
      ];
      this.setState({locationsFilter: obj});
    }
  }

  render() {

    const {search, locationsFilter} = this.state;

    const filteredItems = search ? locationsFilter.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase())
    ) : locationsFilter;
    filteredItems.sort((a, b) => a.name > b.name ? 1 : -1);

    return (
      <div id="Home">
        <div className="hero">
          <div className="container">
            <div className="columns">
              <ul className="menu">
                <AnchorLink to="project"><li>El proyecto</li></AnchorLink>
                <AnchorLink to="audience"><li>Audiencia</li></AnchorLink>
                <AnchorLink to="goals"><li>Objetivos</li></AnchorLink>
                <AnchorLink to="faq"><li>Preguntas Frecuentes</li></AnchorLink>
                <AnchorLink to="contact"><li>Contáctanos</li></AnchorLink>
              </ul>
            </div>

            <div className="columns about" id="project">
              <div className="column">
                <div className="datamexico-logo">
                  <img className="icon" src="/images/logo.svg" alt="" />
                </div>
                <div className="collaborator-icons">
                  <a href="https://www.gob.mx/se/" target="_blank" rel="noopener noreferrer">
                    <img className="mini-icon" src="/images/SE.svg" alt="" />
                  </a>
                  <a href="https://www.matt.org/" target="_blank" rel="noopener noreferrer">
                    <img className="mini-icon" src="/images/matt-white.svg" alt="" />
                  </a>
                  <a href="https://datawheel.us" target="_blank" rel="noopener noreferrer">
                    <img className="mini-icon" src="/images/datawheel-white.svg" alt="" />
                  </a>
                </div>
              </div>
              <div className="column">
                <h2 className="title">El proyecto</h2>
                <p><strong>DataMexico</strong> es un esfuerzo conjunto entre la <strong>Secretaría de Economía (SE)</strong>, <strong>Mexicans and Americans Thinking Together (MATT)</strong> y <strong>Datawheel</strong>, que permite la <span className="highlight">integración</span>, <span className="highlight">visualización</span> y <span className="highlight">análisis de datos</span> para mejorar la toma de decisiones de políticas públicas enfocadas en fomentar la <span className="highligh">innovación</span>, <span className="highligh">inclusión</span> y <span className="highligh">diversificación</span> de la economía mexicana.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container video" id="audience">
          <div className="columns">
            <div className="column">
              <iframe width="100%" src="https://player.vimeo.com/video/341629355" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div>
        <div className="container" id="goals">
          <div className="columns">
            <div className="column">
              <Goal
                icon="integration"
                value="1"
              >
                La creación de una plataforma de <span className="highlight">integración</span>, <span className="highlight">análisis</span> y <span className="highlight">visualización de datos</span>.
              </Goal>
            </div>
            <div className="column">
              <Goal
                icon="hub-research"
                value="2"
              >
                La creación de un <span className="highlight">Research Hub</span> con participantes mexicanos y extranjeros que utilicen la herramienta para hacer investigación y recomendaciones de política pública basada en evidencia.
              </Goal>
            </div>
            <div className="column">
              <Goal
                icon="difusion"
                value="3"
              >
                La <span className="highlight">difusión</span> y <span className="highlight">socialización</span> de la plataforma a lo largo del proyecto, para que la herramienta llegue a todos los usuarios potenciales.
              </Goal>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="columns faq" id="faq">
            <h3 className="title">Preguntas Frecuentes</h3>
            <Question
              title="¿Por qué México necesita una plataforma de datos?"
              isOpen={true}
            >
              <p>Para transformar datos en conocimiento y conocimiento en decisiones estratégicas se necesitan herramientas que ayuden a integrar información de diversas fuentes y que conviertan datos en narrativas articuladas. </p>

              <p>Actualmente, el problema principal de los sitios de datos abiertos se encuentra en la dificultad para encontrar y combinar diferentes fuentes de información, visualizarla y procesarla para tomar decisiones acertadas. </p>

              <p>DataMexico integrará una diversa gama de bases de datos sobre comercio, producción, empleo, educación y demografía (entre otros) para todo el país, con alta resolución espacial a nivel regional y municipal. La plataforma será fundamental para elaborar una política industrial, de innovación y de desarrollo regional que genere riqueza en el país.</p>

              <p>Más allá de la integración de datos, DataMexico incluirá también un componente de investigación, que generará análisis especializados y propuestas de política pública para la economía del país a fin de promover una estructura productiva, diversa y sofisticada. Este eje se pretende llevar a cabo en colaboración con instituciones educativas y de investigación nacionales e internacionales. </p>

            </Question>
            <Question
              title="Quién podrá utilizar DataMexico?"
            >
              <p>La plataforma será pública, gratuita y de código abierto para uso del gobierno y de todos los actores interesados; industrial y empresarial, academia, sociedad civil, gobiernos locales, entre otros.</p>
            </Question>
            <Question
              title="¿Cómo se estimulará la utilización de DataMexico?"
            >
              <p>Para estimular el uso de la herramienta, más allá de la SE, será prioridad su socialización, incluyendo la activación de un nodo de investigación (el Research Hub), que involucra investigadores mexicanos e internacionales. El proyecto promoverá diversos eventos con actores del sector público y privado, siempre con un enfoque multidisciplinario. Adicionalmente, se realizarán capacitaciones y sesiones de retroalimentación de los usuarios, para que así la herramienta sea de utilidad para los actores mexicanos.</p>
            </Question>
            <Question
              title="¿Cuál es la duración y los principales hitos y entregables del proyecto?"
            >
              <p>El proyecto fue lanzado el 30 de Abril de 2019 y será implementado durante tres años. Tiene cuatro momentos importantes:  </p>
              <ul>
                <li><strong>Enero 2020:</strong> lanzamiento de DataMexico 1.0 (con foco en datos productivos y de comercio) y diseminación de los análisis respectivos para apoyar la toma de decisiones de la política industrial del país.</li>
                <li><strong>Enero 2021:</strong> lanzamiento de DataMexico 2.0 (con gama ampliada de datos públicos, e.g. educación, salud, seguridad, vivienda, entre otros) y presentación de resultados de investigación que apoyan políticas públicas. Además, serán realizadas sesiones de entrenamiento para funcionarios públicos, emprendedores y organizaciones de la sociedad civil.</li>
                <li><strong>Septiembre 2021:</strong> lanzamiento de nuevas funcionalidades de descarga de datos, análisis y visualizaciones en DataMexico 3.0 y taller de Transformación Digital para participantes de los sectores público y privado.
                </li>
                <li><strong>Abril 2022:</strong> lanzamiento de un sistema de monitoreo de brechas de inversiones públicas en el cual pueden ser agregadas varias dimensiones, tales como: tipo (saneamiento, salud, infraestructura, etc.), localidad (geocodificada o agregada por estado, município o colonia), o por unidades administrativas (secretaría, gobierno estatal o municipal) lo que garantiza mayor transparencia del uso de los recursos públicos y una mejor evaluación de sus objetivos y eficiencia.
                </li>
              </ul>


            </Question>
            <Question
              title="Soy investigador(a) o miembro de la academia. ¿Cómo puedo participar de DataMexico?"
            >
              <p>DataMexico está formulando un nodo de investigación que inicialmente tiene un enfoque en complejidad económica, geografía económica e innovación. El nodo trabaja en sinergia para generar análisis especializados, investigación y propuestas de política pública para la economía del país a fin de promover una estructura productiva diversa y sofisticada. Para participar del nodo, completa la forma en línea [link to contact form] siguiendo los pasos.</p>

              <p>A lo largo del proyecto se llevarán cabo proyectos de investigación con el objetivo de contestar las siguientes preguntas estratégicas para el de desarrollo económico del país: </p>
              <ul>
                <li>¿Cómo las regiones deben utilizar el conocimiento existente para diversificarse a nuevos sectores? </li>
                <li>¿Qué canasta de productos o sectores se deben priorizar para tener un desarrollo mucho más incluyente?</li>
                <li>¿Cuál es el impacto de los socios comerciales en la diversificación económica de México? </li>
                <li>¿Qué tipo de conocimiento es más importante cultivar (relacionado a la industria o relacionado a la ocupación)?</li>
                <li>¿Cuál es el momento óptimo para enfocarse en nuevas actividades económicas? </li>
                <li>¿Cómo atraemos o creamos un conjunto de talento más diverso? </li>
                <li>¿Cuál es el impacto de introducir nueva tecnología e infraestructura?</li>
              </ul>

            </Question>
            <Question
              title="Soy representante del gobierno local. ¿Cómo puedo formar parte de DataMexico?"
            >
              <p>Desde su génesis, DataMexico integrará una diversidad de bases de datos para todas las regiones del país, con alta resolución espacial, incluyendo el comercio de sus bienes y servicios, productos e industrias, mercado laboral, condiciones educativas, entre otras, de tal forma que la información sea accesible para un mayor número de usuarios. Si, en base a sus atribuciones, usted tiene datos subnacionales que le gustaría aportar al proyecto, escríbanos <a href="mailto:data.mexico@economia.gob.mx">data.mexico@economia.gob.mx</a>  indicando su nombre, institución, función y un resumen de los datos así como la relevancia de estos y otros datos para su administración. Al registrarse en la plataforma DataMexico, usted recibirá un informe periódico de los entrenamientos, talleres, eventos y avances del proyecto.</p>
            </Question>
            <Question
              title="Soy parte del sector privado. ¿Cómo puedo colaborar con DataMexico?"
            >
              <p>Cada vez más, los datos están posicionándose como el insumo más importante de la industria, el comercio y los servicios. Como usuarios o generadores de estos datos, empresas grandes y pequeñas pueden involucrarse activamente con DataMexico, aportando informaciones, comentarios, sugerencias, recursos financieros para la mantención de la plataforma o participando de capacitaciones para su utilización. Para empezar el diálogo con el Equipo de DataMexico, <AnchorLink to="contact">escríbanos</AnchorLink> indicando su nombre, empresa, función y un resumen de sus ideas de colaboración. </p>
            </Question>
            <Question
              title="¿Existen proyectos similares a DataMexico en otros países?"
            >
              <p>Proyectos similares ya se han realizado en otros países: en 2011 fue presentado el <a href="https://atlas.media.mit.edu/es/" target="_blank" rel="noopener noreferrer">Observatorio de Complejidad Económica</a>, que consiste en varias herramientas en línea que le permiten a los usuarios crear visualizaciones de los conjuntos de bienes exportados e importados por varios países para todos los años para los cuales hay datos disponibles. </p>

              <p>En 2016, fue lanzada la plataforma de datos abiertos <a href="https://datausa.io/" target="_blank" rel="noopener noreferrer">DataUSA</a>, que reúne datos de varias encuestas del Censo de Estados Unidos, de los Departamentos de Comercio; de Trabajo; y de Educación, entre otros, para generar análisis y visualizaciones en áreas como trabajo, competencias y educación a través de industrias y geografía. En 2018 se lanzaron <a href="https://es.datachile.io/" target="_blank" rel="noopener noreferrer">DataChile</a> y <a href="http://datakorea.io/en" target="_blank" rel="noopener noreferrer">DataKorea</a>, dos grandes esfuerzos de integración de datos públicos para generar análisis y visualizaciones útiles para la toma de decisiones. </p>
            </Question>
          </div>
        </div>
        <div className="container">
          <div className="columns contact" id="contact">
            <div className="column">
              <h3 className="title">Contáctanos</h3>
              <p>Nos gustaría mantenerte informado sobre este proyecto y a la vez conocer tu opinión. Escríbenos!</p>
            </div>
            <div className="column">
              <form className="contact-form" onSubmit={this.handleSubmit}>
                <Select
                  items={
                    ["Tengo una pregunta", "Tengo un comentario", "Tengo una sugerencia", "Tengo una crítica", "Otro"]
                  }
                  className="dropdown-selector"
                  filterable={false}
                  scrollToActiveItem={true}
                  itemRenderer={d => {
                    const s = this.state.subject === d ? "selected" : "";
                    return (
                      <MenuItem
                        className={s}
                        text={
                          <div className="option">
                            {d}
                          </div>
                        }
                        onClick={() => this.handleSelector("subject", d)}
                      />
                    );
                  }}
                  resetOnSelect={false}
                  resetOnQuery={true}
                >
                  {/* children become the popover target; render value here */}
                  <Button className="dropdown subject" text={this.state.subject} rightIcon="chevron-down" />
                </Select>

                <input onChange={evt => this.handleChange("name", evt)} className="input name" placeholder="¿Cuál es tu nombre?" type="text" />
                <Select
                  items={
                    ["Academia", "Industria", "Sector Público", "Tecnología", "Medios de Comunicación", "Otro"]
                  }
                  className="dropdown-selector"
                  filterable={false}
                  scrollToActiveItem={true}
                  itemRenderer={d => {
                    const s = this.state.sector === d ? "selected" : "";
                    return (
                      <MenuItem
                        className={s}
                        text={
                          <div className="option">
                            {d}
                          </div>
                        }
                        onClick={() => this.handleSelector("sector", d)}
                      />
                    );
                  }}
                  resetOnSelect={false}
                  resetOnQuery={true}
                >
                  {/* children become the popover target; render value here */}
                  <Button 
                    className="dropdown labor" 
                    text={this.state.sector === "" ? <span className="default-question">¿En qué sector trabajas?</span> : this.state.sector} 
                    rightIcon="chevron-down" 
                  />
                </Select>

                <Popover
                  className="dropdown-selector"
                  content={
                    <div className="popover-locations">
                      <InputGroup
                        leftIcon="search"
                        onChange={this.handleInputChange}
                        value={search || ""}
                        placeholder={"Filtrar"}
                        rightElement={<Button onClick={() => this.setState({search: undefined})} className="button-list" icon="cross" />}
                      />
                      <ul>
                        {this.state.locationsFilter[0] && this.state.locationsFilter[0].depth !== "country" 
                          ? <li className="return" onClick={() => this.backLocation(this.state.locationsFilter[0])}>Volver</li>
                          : ""}
                        {filteredItems.map((d, i) => {
                          const s = this.state.locationPivot.id === d.id ? "selected" : "";
                          return <li className={s} key={`item_${d.depth}_${i}`} onClick={() => this.handleLocation(d)}>
                            <span>{d.name}</span>
                            {d.depth === "ent" || d.id === "mx" ? <Icon icon="chevron-right" /> : <span />}
                          </li>;
                        })}
                        {filteredItems.length === 0 ? <li>Sin resultados</li> : ""}
                      </ul>
                    </div>
                  }
                  interactionKind={PopoverInteractionKind.CLICK}
                  isOpen={this.state.isOpen}
                  onInteraction={state => this.setState({isOpen: state})}
                  position={Position.BOTTOM}
                >
                  <Button 
                    className="dropdown location"
                    onClick={() => this.setState({isOpen: !this.state.isOpen})}
                    text={this.state.location === "" 
                      ? <span className="default-question">¿Qué localidad representas a través de esta comunicación?</span> : this.state.location
                    } 
                    rightIcon="chevron-down" 
                  />
                </Popover>

                <label className="label message">Tu mensaje</label>
                <textarea onChange={evt => this.handleChange("message", evt)} className="textarea" name="" id="" cols="30" rows="10"></textarea>
                <input onChange={evt => this.handleChange("email", evt)} className="input mail" placeholder="Correo electrónico" type="email" />
                <input className="submit" type="submit" />
              </form>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="container">
            <div className="columns">
              <div className="column">
                <img className="mini-icon" src="/images/logo.svg" alt="" />
              </div>
              <div className="column mini-logos collaborator-icons">
                <a href="https://www.gob.mx/se/" target="_blank" rel="noopener noreferrer">
                  <img className="mini-icon" src="/images/SE-gray.svg" alt="" />
                </a>
                <a href="https://www.matt.org/" target="_blank" rel="noopener noreferrer">
                  <img className="mini-icon" src="/images/matt-gray.svg" alt="" />
                </a>
                <a href="https://datawheel.us/" target="_blank" rel="noopener noreferrer">
                  <img className="mini-icon" src="/images/datawheel-gray.svg" alt="" />
                </a>
              </div>
            </div>
          </div>
        </footer>

        <Toaster position={Position.BOTTOM}>
          {this.state.showToast && <Toast
            message="Mensaje ha sido enviado exitosamente."
            intent="success"
            timeout="2000"
            onDismiss={evt => this.setState({ showToast: false })}
          />}
        </Toaster>
      </div>
    );
  }

}
