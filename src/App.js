import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Modal,
  TextField,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f2f2f2',
    minHeight: '100vh',
    padding: theme.spacing(2),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s',
    '&:hover': {
      boxShadow: '0 8px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  promoted: {
    backgroundColor: '#e0f7fa',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    outline: 'none',
  },
  searchContainer: {
    marginBottom: theme.spacing(2),
  },
  title: {
    color: '#2196f3',
    marginBottom: theme.spacing(2),
  },
  noListingsText: {
    marginTop: theme.spacing(2),
  },
  jobDetails: {
    marginBottom: theme.spacing(2),
  },
  linkButton: {
    backgroundColor: '#000',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#111',
    },
  },
  stickyButtonContainer: {
    position: 'sticky',
    bottom: 16,
    right: 16,
    zIndex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
  },
  promotedSection: {
    marginBottom: theme.spacing(4),
  },
  otherListingsSection: {
    marginBottom: theme.spacing(4),
  },
}));

const JobBoardApp = () => {
  const classes = useStyles();
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(
        'https://api.airtable.com/v0/appWI09FiPgQXRTxb/job%20listing',
        {
          headers: {
            Authorization: 'Bearer keyXhVoImZrZIEGKy',
          },
        }
      );
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

  const promotedJobs = filteredJobs.filter((job) => job.fields.promoting === "true");

  return (
    <div className={classes.root}>
      <Typography variant="h4" align="center" gutterBottom>
        Job Board
      </Typography>
      <div className={classes.searchContainer}>
        <TextField
          label="Search by Job Title"
          value={searchTerm}
          onChange={handleSearchTermChange}
          variant="outlined"
          fullWidth
        />
      </div>

      {promotedJobs.length > 0 && (
        <div className={classes.promotedSection}>
          <Typography variant="h5" align="center" gutterBottom>
            Promoted Jobs
          </Typography>
          <Grid container spacing={2}>
            {promotedJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card className={`${classes.card} ${classes.promoted}`} onClick={() => handleJobClick(job)}>
                  <CardContent>
                    <Typography variant="h6" className={classes.title}>
                      {job.fields.title}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Company: {job.fields.company}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Compensation: {job.fields.compensation}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Location: {job.fields.location}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Status: {job.fields.status}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Type: {job.fields.type}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {filteredJobs.length > 0 ? (
        <div className={classes.otherListingsSection}>
          <Typography variant="h5" align="center" gutterBottom>
            All Other Job Listings
          </Typography>
          <Grid container spacing={2}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} sm={6} md={4} key={job.id}>
                <Card className={classes.card} onClick={() => handleJobClick(job)}>
                  <CardContent>
                    <Typography variant="h6" className={classes.title}>
                      {job.fields.title}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Company: {job.fields.company}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Compensation: {job.fields.compensation}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Location: {job.fields.location}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Status: {job.fields.status}
                    </Typography>
                    <Typography variant="body2" className={classes.jobDetails}>
                      Type: {job.fields.type}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      ) : (
        <Typography variant="body1" align="center" className={classes.noListingsText}>
          No jobs found.
        </Typography>
      )}

      <Modal open={openModal} onClose={handleModalClose} className={classes.modal}>
        <div className={classes.modalContent}>
          {selectedJob && (
            <>
              <Typography variant="h5" className={classes.title}>
                {selectedJob.fields.title}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Description: {selectedJob.fields.description}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Company: {selectedJob.fields.company}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Compensation: {selectedJob.fields.compensation}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Type: {selectedJob.fields.type}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Location: {selectedJob.fields.location}
              </Typography>
              <Typography variant="body2" className={classes.jobDetails}>
                Status: {selectedJob.fields.status}
              </Typography>
              <Button
                variant="contained"
                className={classes.linkButton}
                onClick={() => window.open(selectedJob.fields.link, '_blank')}
              >
                Visit Job Link
              </Button>
            </>
          )}
        </div>
      </Modal>
      <div className={classes.stickyButtonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.open('https://airtable.com/shrF7d5hcPg97327C', '_blank')}
        >
          Post or Promote Job
        </Button>
      </div>
    </div>
  );
};

export default JobBoardApp;
