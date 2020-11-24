import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Container, Card } from "react-bootstrap";
import { useState, useEffect } from "react";

import Modal from "react-bootstrap/Modal";

const currentColumns = [
  {
    id: "todo",
    label: "Todo",
  },
  {
    id: "in-progress",
    label: "In Progress",
  },
  {
    id: "completed",
    label: "Completed",
  },
];

const currentTasks = [
  {
    id: "buy-grocery",
    label: "Buy grocery",
    column: "todo",
  },
  {
    id: "cook-dinner",
    label: "Cook dinner",
    column: "todo",
  },
  {
    id: "eat-dinner",
    label: "Eat dinner",
    column: "in-progress",
  },
  {
    id: "do-laundry",
    label: "Do laundry",
    column: "completed",
  },
];

function App() {
  const [tasks, setTasks] = useState(currentTasks);
  const [columns, setColumns] = useState(currentColumns);
  const [cname, setCname] = useState("");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClickDeleteTask = (taskId) => {
    console.log(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleClickDeleteColumn = (columnId) => {
    setColumns(columns.filter((column) => column.id !== columnId));
  };

  const handleClickAddTask = (columnId) => {
    const label = prompt("Task Name?");
    label &&
      setTasks([
        ...tasks,
        { label, id: label.toLowerCase(), column: columnId },
      ]);
  };

  const handleClickAddColumn = () => {
    const label = cname;
    label && setColumns([...columns, { label, id: label.toLowerCase() }]);
  };

  // useEffect(
  //   (prevCname) => {
  //     setCname(prevCname === "");
  //   },
  //   [cname]
  // );

  return (
    <Container>
      <div>
        <h1 className="pt-5 mb-3 text-white">
          SIMPLE KANBAN{" "}
          <Button className="ml-3 mb-1" variant="success" onClick={handleShow}>
            + Add Column
          </Button>
        </h1>

        <Modal show={show} onHide={handleClose} centered animation={true}>
          <Modal.Body>
            <input
              onChange={(event) => setCname(event.target.value)}
              className="colname w-100"
              placeholder="Enter column name"
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="mx-auto"
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              className="mx-auto"
              variant="primary"
              onClick={() => {
                handleClickAddColumn();
                handleClose();
              }}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <Row>
        {columns.map((idx) => (
          <Col md="3">
            <Card className="column shadow mt-4 mx-0 py-4">
              <h5 className="mt-0 mb-4">
                {idx.label}{" "}
                {tasks.filter((task) => task.column === idx.id).length < 1 ? (
                  <Button
                    variant="danger"
                    className="delColumn"
                    onClick={() => handleClickDeleteColumn(idx.id)}
                  >
                    x
                  </Button>
                ) : null}
              </h5>

              {tasks
                .filter((task) => task.column === idx.id)
                .map((task) => (
                  <p key={task.id} className="task shadow-sm">
                    {task.label}{" "}
                    <Button
                      className="delTasks"
                      variant="light"
                      onClick={() => handleClickDeleteTask(task.id)}
                    >
                      x
                    </Button>
                  </p>
                ))}
              <Button
                variant="light"
                className="w-100"
                onClick={() => handleClickAddTask(idx.id)}
              >
                + Add Task
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default App;
