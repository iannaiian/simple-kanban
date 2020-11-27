import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Row, Col, Container, Card, Modal } from "react-bootstrap";
import { useState, useEffect } from "react";

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
  const [tasks, setTasks] = useState(null);
  const [columns, setColumns] = useState(null);
  const [cname, setCname] = useState("");

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL || "http://localhost:1337" + "/columns")
      .then((res) => res.json())
      .then((result) => setColumns(result));

    fetch(process.env.REACT_APP_API_URL || "http://localhost:1337" + "/tasks")
      .then((res) => res.json())
      .then((result) => setTasks(result));
  }, []);

  console.log(tasks);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClickDeleteTask = (taskId) => {
    console.log(taskId);
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleClickDeleteColumn = (columnId) => {
    fetch(
      process.env.REACT_APP_API_URL ||
        "http://localhost:1337" + "/columns/" + columnId,
      {
        method: "DELETE",
      }
    );
    const updatedCol = columns.filter((column) => column.id !== columnId);

    setColumns(updatedCol);
  };

  const handleClickAddTask = (columnId) => {
    const label = prompt("Task Name?");

    fetch(process.env.REACT_APP_API_URL || "http://localhost:1337" + "/tasks", {
      method: "POST",
      body: JSON.stringify({
        label,
        column: columnId,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((result) => setTasks((prevTasks) => [...prevTasks, result]));

    // label &&
    //   setTasks([
    //     ...tasks,
    //     { label, id: label.toLowerCase(), column: columnId },
    //   ]);
  };

  const handleChange = (event) => {
    setCname(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleClickAddColumn(cname);
    handleClose();
    setCname("");
  };

  const handleClickAddColumn = (label) => {
    fetch(
      process.env.REACT_APP_API_URL || "http://localhost:1337" + "/columns",
      {
        method: "POST",
        body: JSON.stringify({
          label,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => res.json())
      .then((result) => setColumns((prevColumns) => [...prevColumns, result]));

    // const label = cname;
    // label && setColumns([...columns, { label, id: label.toLowerCase() }]);
    // setCname("");
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
          <form onSubmit={onSubmit}>
            <Modal.Body>
              <input
                onChange={handleChange}
                value={cname}
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
              <Button className="mx-auto" variant="primary" type="submit">
                Save Changes
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      </div>

      <Row>
        {columns &&
          columns.map((idx) => (
            <Col md="3">
              <Card className="column shadow mt-4 mx-0 py-4">
                <h5 className="mt-0 mb-4">
                  {idx.label}{" "}
                  {tasks &&
                  tasks.filter((task) => task.column.id === idx.id).length <
                    1 ? (
                    <Button
                      variant="danger"
                      className="delColumn"
                      onClick={() => handleClickDeleteColumn(idx.id)}
                    >
                      x
                    </Button>
                  ) : null}
                </h5>

                {tasks &&
                  tasks
                    .filter((task) => task.column.id === idx.id)
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
