import React, { FC } from 'react';
import './styles.scss';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import CustomButton from '../CustomButton/CustomButton';
import { format } from 'date-fns';

const ProjectTile: FC<{ name: string; activeTasks: number; progressBar: number; typeOfProject: string; endDate: string }> = ({
  name,
  activeTasks,
  progressBar,
  typeOfProject,
  endDate,
}) => {

  const history = useHistory();
  const handleOnClickMore = () => {
    history.push(`/project/${id}`);
  };

  return (
    <section className="tile-container">
      <div>
        <CircularProgressbar
          styles={buildStyles({
            backgroundColor: '#292929',
          })}
          background
          backgroundPadding={3}
          value={progressBar}
          text={`${progressBar}%`}
        />
      </div>
      <h3>{name}</h3>
      <div>
        <p>Aktywne zadania</p>
        <h4>{activeTasks}</h4>
      </div>
      <div>
        <p>Typ projektu</p>
        <h4>{typeOfProject}</h4>
      </div>
      <div>
        <p>Deadline</p>
        <h4>{format(new Date(endDate || Date.now()), 'dd.MM.yyyy')}</h4>
      </div>
      <CustomButton className="btn-project" onClick={handleOnClickMore}>
        Rozwiń &#10095;
      </CustomButton>
    </section>
  );
};

export default ProjectTile;
