import React, { useEffect, useMemo } from 'react';
import './styles.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects, selectProjects } from 'redux/project/project.slice';
import { projectType } from 'core/types/api/project.requests.types';
// components
import AddProject from 'containers/AddProject/AddProject';
import BasicSpeedDial from 'components/BasicSpeedDial/BasicSpeedDial';
import AddIcon from '@mui/icons-material/Add';
import ProjectTile from '../../components/ProjectTile/ProjectTile';

const MainLayout = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const [addProjectModal, setAddProjectModal] = React.useState(false);
  const actions = useMemo(
    () => [
      {
        icon: <AddIcon />,
        name: 'Dodaj nowy projekt',
        handleOnClick: () => setAddProjectModal(true),
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(getProjects());
  }, [dispatch]);

  return (
    <div className="container">
      {projects?.length ? (
        <>
          {projects.map((project: projectType) => {
            const card = {
              id: project.id,
              name: project.name,
              activeTasks: 26,
              progressBar: project.progressPercentage,
              typeOfProject: 'Aplikacja',
              endDate: project.dueDate,
            };
            return <ProjectTile {...card} key={project.id} />;
          })}
        </>
      ) : (
        <h1> No projects </h1>
      )}
      <BasicSpeedDial actions={actions} />
      {addProjectModal && <AddProject open={addProjectModal} handleClose={() => setAddProjectModal(false)} />}
    </div>
  );
};

export default MainLayout;
