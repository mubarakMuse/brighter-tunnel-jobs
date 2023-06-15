import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Modal, Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


const JobBoardApp = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://api.airtable.com/v0/appWI09FiPgQXRTxb/job%20listing', {
        headers: {
          Authorization: 'Bearer keyXhVoImZrZIEGKy',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.records);
    } catch (error) {
      console.log('Error fetching jobs:', error);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const filteredJobs = jobs.filter((job) =>
    job.fields.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const promotedJobs = filteredJobs.filter((job) => job.fields.promoting === 'true');

  return (
    <div className="bg-light min-vh-100 py-2">
      <Container>
        <h4 className="text-center">Job Board</h4>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Job Title"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
        </div>

        {promotedJobs.length > 0 && (
          <div className="mb-4">
            <h5 className="text-center">Promoted Jobs</h5>
            <Row xs={1} md={2} lg={3} className="g-4">
              {promotedJobs.map((job) => (
                <Col key={job.id}>
                  <Card className="h-100 cursor-pointer" onClick={() => handleJobClick(job)}>
                    <Card.Body>
                      <Card.Title className="text-primary">{job.fields.title}</Card.Title>
                      <Card.Text>{job.fields.company}</Card.Text>
                      <Card.Text>{job.fields.compensation}</Card.Text>
                      <Card.Text>{job.fields.location}</Card.Text>
                      <Card.Text>{job.fields.status}</Card.Text>
                      <Card.Text>{job.fields.type}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {filteredJobs.length > 0 ? (
          <div className="mb-4">
            <h5 className="text-center">All Other Job Listings</h5>
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredJobs.map((job) => (
                <Col key={job.id}>
                  <Card className="h-100 cursor-pointer" onClick={() => handleJobClick(job)}>
                    <Card.Body>
                      <Card.Title className="text-primary">{job.fields.title}</Card.Title>
                      <Card.Text>{job.fields.company}</Card.Text>
                      <Card.Text>{job.fields.compensation}</Card.Text>
                      <Card.Text>{job.fields.location}</Card.Text>
                      <Card.Text>{job.fields.status}</Card.Text>
                      <Card.Text>{job.fields.type}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ) : (
          <p className="text-center">No jobs found.</p>
        )}

        <Modal show={openModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedJob?.fields.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Description: {selectedJob?.fields.description}</p>
            <p>Company: {selectedJob?.fields.company}</p>
            <p>Compensation: {selectedJob?.fields.compensation}</p>
            <p>Type: {selectedJob?.fields.type}</p>
            <p>Location: {selectedJob?.fields.location}</p>
            <p>Status: {selectedJob?.fields.status}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => window.open(selectedJob?.fields.link, '_blank')}>
              Visit Job Link
            </Button>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="position-sticky bottom-0 end-0 p-2">
          <Button
            variant="primary"
            onClick={() => window.open('https://airtable.com/shrF7d5hcPg97327C', '_blank')}
          >
            Post or Promote Job
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default JobBoardApp;
