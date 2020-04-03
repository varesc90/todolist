import React from 'react';
import {Modal, Col, Row, Button, InputGroup, FormControl, Accordion, Card,ListGroup} from 'react-bootstrap'
import axios from 'axios';

class Todo extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            todo: [],
            inputTodo:"",
            form:""
        }
    }


    componentDidMount() {
        this.fetchTodo();
    }

    fetchTodo = () => {
        axios.get("http://localhost:3000/api/v1/todos").then((res) => {
            this.setState({
                todo: res.data.map( data => {
                    data.form = "";
                    return data;
                })
            });
        });
    }

    onChangeStInput= (id,status) => {
        const newStatus = status == "completed"?"pending":"completed";
        axios.put(`http://localhost:3000/api/v1/subtasks/${id}`,{"status":newStatus}).then((res) => {
            this.fetchTodo();
        })
    }

    onCheckTd= (id,status) => {
        const newStatus = status == "completed"?"pending":"completed";
        console.log(newStatus);
        axios.put(`http://localhost:3000/api/v1/todos/${id}`,{"status":newStatus}).then((res) => {
            this.fetchTodo();
        })
    }

    onChangeInput = (e) => {
        this.setState({
            inputTodo:e.target.value
        });
    }

    addTodo = () => {
        axios.post("http://localhost:3000/api/v1/todos",{"title":this.state.inputTodo}).then((res) => {
            this.setState({
                inputTodo: ""
            });
            this.fetchTodo();
        })
    }

    onEditSubtaskInput = (e,index) => {
        var newState = this.state.todo;
        newState[index].form = e.target.value;
        this.setState({
            todo:newState
        });
    }

    addSubTask = (index) => {
        axios.post("http://localhost:3000/api/v1/subtasks",{"title":this.state.todo[index].form,"todo_id":this.state.todo[index].data.id}).then((res) => {
            var newState = this.state.todo;
            newState[index].form = "";
            this.setState({
                todo:newState
            });
            this.fetchTodo();
        })
    }

    renderTodo = () => {
        if(this.state.todo.length === 0){
            return "You have notthing todo";
        }
        return this.state.todo.map((data,index) => {
            return (
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={data.data.id}>
                            <input className="mx-5" type="checkbox" onChange={() => {this.onCheckTd(data.data.id,data.data.status)}} />
                            {data.data.title}
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={data.data.id}>
                        <Card.Body>
                                <ListGroup as="ul">
                                {data.data.subtasks.map( st => {
                                    if(st.title){
                                        return (
                                            <ListGroup.Item as="li">
                                                <input className="mx-5" type="checkbox" onChange={() => {this.onChangeStInput(st.id,st.status)}} checked={st.status === "completed"?"checked":""} />
                                                <label>{st.title}</label>
                                            </ListGroup.Item>
                                        )
                                    }
                                })}
                                <InputGroup size="sm" className="my-3">
                                    <FormControl placeholder="new subtask" value={data.form} onChange={(e) => this.onEditSubtaskInput(e, index)} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                                </InputGroup>
                                <Button onClick={() => this.addSubTask(index)} variant="outline-primary" >Add
                                SubTask</Button>
                                </ListGroup>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                // <Row key={data.data.id}>
                //     <Col md="3"><input type="checkbox" checked={data.data.status === "checked" ? "false" : ""} /></Col>
                //     <Col md="9">{data.data.title}</Col>
                // </Row>
            );

        });
    }


    render() {


        return (
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Todo</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InputGroup size="sm" className="mb-3">
                        <FormControl value={this.state.inputTodo} onChange={(e) => this.onChangeInput(e)} aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
                    </InputGroup>
                    <Button block onClick={() => this.addTodo()}>Add</Button>

                    <Accordion className="my-2" defaultActiveKey="0">
                        {this.renderTodo()}
                    </Accordion>

                </Modal.Body>

            </Modal.Dialog>
        )
    }
}

export default Todo;