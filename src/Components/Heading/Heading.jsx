import React from 'react'

import "./Heading.scss"
export default function Heading() {
  return (
    <div className="poke-home-heading">
        <h1 className="poke-home-heading-title heading_bolder">Pokédex</h1>
        <div className="poke-home-heading-divider" data-testid="divider"></div>
        <span className="poke-home-heading-desc heading_bold">
          Search of any Pokémon that exists on the planet
        </span>
      </div>
  )
}
