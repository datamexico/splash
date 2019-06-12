import React from "react";

/** */
export function GoogleForm() {
  return <form action="" className="contact-form">
    <input className="input" placeholder="Tengo una pregunta" type="text" />
    <input className="input" placeholder="Cuál es tu nombre?" type="text" />
    <span className="label">Tu mensaje</span>
    <textarea className="textarea" name="" id="" cols="30" rows="10"></textarea>
    <input className="input" placeholder="Correo electrónico" type="text" />
    <input className="submit" type="submit" />
  </form>;
}
