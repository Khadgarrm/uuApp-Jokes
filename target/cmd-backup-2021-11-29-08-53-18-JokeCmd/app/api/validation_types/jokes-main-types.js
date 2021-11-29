/* eslint-disable */

const jokesInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri().isRequired("uuAppProfileAuthorities"),
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
})
