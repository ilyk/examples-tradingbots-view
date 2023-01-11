import {BehaviorSubject} from "rxjs";
import {Api} from "../_api";
import {history} from "./history";

interface ProjectInterface {
    id: string,
    name: string,
    base_currency: string,
}

// noinspection JSPrimitiveTypeWrapperUsage
const projectsSubject = new BehaviorSubject([]),
    currentProjectSubject = new BehaviorSubject({id: ""}),
    findById = (id) => {
        const projects = projectsSubject.getValue();
        for (const idx in projects) {
            if (projects.hasOwnProperty(idx) && projects[idx].id === id) {
                return projects[idx]
            }
        }
        return {id: ""}
    }


const currentProject = () => {
    currentProjectSubject.next(findById(localStorage.getItem("project_current")))
}, loadProjects = () => {
    Api.forProject().list()
        .then(p => projectsSubject.next(p))
        .then(currentProject)
        .catch(() => setTimeout(loadProjects, 1000))
}

export const Project = {
    get current() :ProjectInterface {
        return currentProjectSubject.value
    },
    set currentId(id) {
        localStorage.setItem("project_current", id)
        currentProject()
    },
    get currentId() {
        return currentProjectSubject.value ? currentProjectSubject.value.id : ""
    },
    subscribeCurrentId(callback) {
        return currentProjectSubject.subscribe(callback)
    },
    loadProjects: loadProjects,
    projects: projectsSubject.asObservable(),
    createNew: () => {
        const projectId = window.prompt("Enter new project id (couldn't be changed later):")
        if (projectId === null) {
            return
        }

        history.push(`/projects/${projectId}`)
        return false
    }
}
