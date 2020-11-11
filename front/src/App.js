import React from 'react';
import {Container, Row, Col, FormGroup, Label, Input, Button, Alert} from 'reactstrap';


export default class App extends React.Component {
  constructor(){
    super();

    this.state = {
      operador1: "",
      operador2: "",
      resultado: "",
      mensagem: "",
      erro: true,
      lista: []
    }
  }

  Operacao(operator) {
    if(operator === "/"){ operator = "%2F"};
    if(operator === "++"){ operator = +1};

    if(this.state.operador1 === '' || this.state.operador2 === ''){
      this.setState({
        mensagem: "Informe os operandos para realizar a operação"
      })
    }

    fetch(`http://localhost:3101/log/${this.state.operador1}/${this.state.operador2}/${operator}`)
      .then(obj => obj.json())
      .then(
        (json) => {
          if (json.erro) {
            this.setState({
              erro: false,
              mensagem: json.message
            });
          }
          else {
            this.setState({
              resultado: json.result
            })
            this.componentDidMount()
          }
        }
      )
      .catch((json) => {
        this.setState({
          erro:false
        })
      })
    }

  deletarOperacao(e, index){
      e.preventDefault();

      fetch(`http://localhost:3101/log/${index}`)
      .then(obj => obj.json)
      .then(
        (json) => {
          if (json.message){
            this.setState({
              erro: false,
              mensagem: json.message
            })
          }
          else{
            this.componentDidMount()
          }
        }
      )
  }

  componentDidMount(){
    fetch(`http://localhost:3101/log`)
    .then(obj => obj.json())
    .then(
      (json) => {
        if (json.message){
          this.setState({
            erro: false,
            mensagem: json.message
          })
        }
        else {
            this.setState({
              lista: json.result
            })
        }
      }
    )
    
  }


  render() {
    return (
      <Container className="mt-2">

        <Row className="justify-content-center">
          <Col className= 'border col-sm-3 col-md-3 col-lg-2 mr-2'>
            <FormGroup>
              <Label>Operando</Label>
              <Input id="operador1" type='text' placeholder='Número' className="text-right" 
                value={this.state.operador1}
                onChange = {(e) => this.setState({operador1: e.target.value })}
              />
            </FormGroup>
          </Col>
          <Col className= 'border col-sm-3 col-md-3 col-lg-2 mr-2'>
            <FormGroup>
              <Label>Operando</Label>
              <Input id="operador2" type='text' placeholder='Número' className="text-right" 
                value={this.state.operador2} 
                onChange={(e) => this.setState({operador2: e.target.value})}
              />
            </FormGroup>
          </Col>
          <Col className= 'border col-sm-3 col-md-3 col-lg-2'>
            <FormGroup>
              <Label>Resultado</Label>
              <Input id="resultado" type='text' placeholder='Resposta' className="text-right" 
              value={this.state.resultado} disabled/>
            </FormGroup>
          </Col>
        </Row>

        <Row className="justify-content-center mt-2">
                <Col className="border col-sm-9 col-md-9 col-lg-6 pt-2 pb-2">
                    <Label>Operações:</Label>
                    <Button color='secondary' className='ml-3 mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}} >+</Button>
                    <Button color='secondary' className='mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}}>-</Button>
                    <Button color='secondary' className='mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}}>*</Button>
                    <Button color='secondary' className='mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}}>/</Button>
                    <Button color='secondary' className='mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}}>**</Button>
                    <Button color='secondary' className='mr-1 justify-content-center' onClick={e => {this.Operacao(e.currentTarget.textContent)}}>++</Button>
                </Col>
            </Row>

            {
              (this.state.mensagem !== "") ? 
              <Row className="justify-content-center mt-2">
                <Alert color='danger' className='col-sm-9 col-md-9 col-lg-6'>
                  {this.state.mensagem}
                </Alert>
              </Row> : ""
            }

        <Row className="justify-content-center mt-2">
          <Col className="border col-sm-9 col-md-9 col-lg-6 overflow-auto" style={{maxHeight:200}}>
             <div>
               {
               this.state.lista.map((item) => 
                 <Col key={item.idlog} onContextMenu={(e) => this.deletarOperacao(e, item.idlog)}>
                    <Row>{item.operacao} ({item.horario})</Row>
                 </Col>
               )
             }
             </div>
          </Col>
        </Row>

      </Container>

    );
  }
}


// author: Bruna Larissa Clemente Gomes - ADS B